import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * 递归查找文件夹内的文件
 * @param path 根目录
 * @returns
 */
function finder(path: string, deep: boolean) {
  const files: string[] = [];
  const dir = readdirSync(path);
  for (const item of dir) {
    const fullPath = join(path, item);
    const fileStat = statSync(fullPath);
    if (existsSync(fullPath)) {
      if (fileStat.isDirectory() && deep) {
        files.push(...finder(fullPath, deep));
        //排除非js和ts文件
      } else if (fileStat.isFile() && /((?<!\.d)\.ts|\.js)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * 自动导入指定目录下的所有模块
 * @param rootPath 根目录
 * @param deep 是否递归查找
 * @param ignore 忽略的文件名
 * @returns
 */
export function importModules(
  rootPath: string,
  deep = false,
  ignore?: RegExp | string[]
) {
  if (rootPath.startsWith("./")) {
    throw new Error("不支持相对路径导入");
  }

  const result: any[] = [];
  for (let file of finder(rootPath, deep)) {
    file = file.replaceAll("\\", "/");
    if (Array.isArray(ignore)) {
      const tmp = file.split("/");
      const fileName = tmp[tmp.length - 1];

      if (ignore.includes(fileName)) {
        continue;
      }
    } else {
      if (ignore?.test(file)) {
        continue;
      }
    }

    if (require(file).default) {
      result.push(require(file).default);
    } else {
      const target = Object.values(require(file));
      if (target.length != 1) {
        throw new Error(`模块(${file})未找到任何导出或找到多个导出`);
      }
      result.push(target[0]);
    }
  }
  return result;
}
