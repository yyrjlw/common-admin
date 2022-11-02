import { LoadStrategy, UnderscoreNamingStrategy } from "@mikro-orm/core";
import { Options, Configuration } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

const log = new Logger("mikro-orm");

export default {
  type: "mysql",
  dbName: "test",
  user: "root",
  password: "lw445302",
  host: "192.168.110.8",
  port: 3306,
  charset: "utf8mb4",
  timezone: "+08:00",
  entities: ["dist/models/entity/**/*.js"],
  namingStrategy: UnderscoreNamingStrategy, //小写加下划线命名策略
  forceUndefined: true, //将空值映射为undefined
  debug: true,
  logger: (message: string) => log.log(message),
  highlighter: new SqlHighlighter(), //输出漂亮的sql语句到日志
  schemaGenerator: {
    createForeignKeyConstraints: false //不生成外键约束
  },
  //全局 软删除 过滤器
  filters: {
    softDelete: {
      cond: (_, type: "read" | "update" | "delete") => {
        if (["read", "update"].includes(type)) {
          return { isDelete: false };
        }
      },
      args: false
    }
  },
  loadStrategy: LoadStrategy.JOINED, //关系查询使用left join(只输出一条sql语句，而不是select .... in 两条SQL)
  migrations: {
    path: "dist/db/migrations"
  },
  seeder: {
    path: "dist/db/seeders",
    defaultSeeder: "DatabaseSeeder"
  }
} as Options | Configuration;
