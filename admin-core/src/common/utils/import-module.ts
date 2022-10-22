import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

/** 自动导入指定目录下的所有export default模块 */
export function importModules(rootPath: string, deep = false) {
  function finder(path: string) {
    const files: string[] = [];
    const dir = readdirSync(path);
    for (const item of dir) {
      const fullPath = join(path, item);
      const fileStat = statSync(fullPath);
      if (existsSync(fullPath)) {
        if (fileStat.isDirectory() && deep) {
          files.push(...finder(fullPath));
          //排除非js和ts文件
        } else if (fileStat.isFile() && /((?<!\.d)\.ts|\.js)$/.test(item)) {
          files.push(fullPath.replace("\\", "/"));
        }
      }
    }

    return files;
  }

  const result: any[] = [];
  for (const i of finder(rootPath)) {
    result.push(require(i).default);
  }
  return result;
}
