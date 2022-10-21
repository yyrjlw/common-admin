import { Module } from "@nestjs/common";
import { importModules } from "src/common/utils/import-module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./share/service/logger.service";

@Module({
  imports: [ConfigModule],
  controllers: [...importModules(__dirname + "/controllers", true)],
  providers: [LoggerService],
})
export class AppModule {}
