import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { Options, Configuration } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
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
  entities: ["dist/model/entity/**/*.js"],
  entitiesTs: ["src/model/entity/**/*.ts"],
  metadataProvider: TsMorphMetadataProvider,
  namingStrategy: UnderscoreNamingStrategy, //小写加下划线命名策略
  forceUndefined: true, //将空值映射为undefined
  debug: true,
  logger: (message: string) => log.log(message),
  highlighter: new SqlHighlighter(),
  schemaGenerator: {
    createForeignKeyConstraints: false, //不生成外键约束
  },
  migrations: {
    path: "dist/db/migrations",
    pathTs: "src/db/migrations",
  },
  seeder: {
    pathTs: "src/db/seeders",
    path: "dist/db/seeders",
    defaultSeeder: "DatabaseSeeder",
  },
} as Options | Configuration;
