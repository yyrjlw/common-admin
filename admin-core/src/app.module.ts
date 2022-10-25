import { MikroOrmModule } from "@mikro-orm/nestjs";
import {
  CacheModule,
  CacheModuleOptions,
  CacheStore,
  Module,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { importModules } from "src/common/utils/import-module";
import { AuthGuard } from "./common/guards/auth.guard";
import { CacheConfig, JwtConfig } from "./config/config.model";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { redisStore } from "cache-manager-redis-store";
import { TestController } from "./controllers/test.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    //导入jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>("jwt").secret,
      }),
      inject: [ConfigService],
    }),
  ],
  //导入controllers
  controllers: importModules(__dirname + "/controllers/admin", true),
  //使用权限验证守卫
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
class AdminControllerModule {}

@Module({
  imports: [
    //配置
    ConfigModule,
    //ORM
    MikroOrmModule.forRoot(),
    //缓存
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const cacheConfigResult: CacheModuleOptions = {
          ttl: 60 * 60 * 24 * 7,
        };
        const cacheConfig = configService.get<CacheConfig>("cache");
        if (cacheConfig.enableRedis) {
          const store = await redisStore({
            socket: {
              host: cacheConfig.redisHost,
              port: cacheConfig.redisPort,
            },
            password: cacheConfig.redisPassword,
            database: cacheConfig.redisDatabase,
          });
          cacheConfigResult.store = store as unknown as CacheStore;
        }
        return cacheConfigResult;
      },
      inject: [ConfigService],
    }),
    //为admin module配置url前缀
    RouterModule.register([
      {
        path: "admin",
        module: AdminControllerModule,
      },
    ]),
  ],
  controllers: [TestController],
  //导入services
  providers: [...importModules(__dirname + "/service", true)],
})
export class AppModule {}
