import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { importModules } from "src/common/utils/import-module";
import { ConfigModule } from "./config/config.module";

@Module({
  controllers: importModules(__dirname + "/controllers/admin", true),
})
class AdminControllerModule {}

@Module({
  imports: [
    ConfigModule,
    AdminControllerModule,
    MikroOrmModule.forRoot(),
    RouterModule.register([
      {
        path: "admin",
        module: AdminControllerModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
