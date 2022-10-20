import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export function importModules(rootPath: string, deep = false) {
  function finder(path: string) {
    const files = [];
    const dir = readdirSync(path);
    for (const item of dir) {
      const fullPath = join(path, item);
      const fileStat = statSync(fullPath);
      if (existsSync(fullPath)) {
        if (fileStat.isDirectory && deep) {
          files.push(...finder(fullPath));
        } else if (fileStat.isFile() && item.endsWith(".js")) {
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
