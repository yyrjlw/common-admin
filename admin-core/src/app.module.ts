import { MikroOrmMiddleware, MikroOrmModule } from "@mikro-orm/nestjs";
import {
  CacheModule,
  CacheModuleOptions,
  CacheStore,
  MiddlewareConsumer,
  Module,
  NestModule
} from "@nestjs/common";
import { importModules } from "src/common/utils/import-module";
import { CacheConfig, JwtConfig } from "./config/config.model";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { redisStore } from "cache-manager-redis-store";
import { JwtModule } from "@nestjs/jwt";
import { join } from "path";

@Module({
  imports: [
    //配置
    ConfigModule,
    //导入jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtConfig>("jwt").secret,
        signOptions: {
          expiresIn: configService.get<JwtConfig>("jwt").expiresIn
        }
      }),
      inject: [ConfigService]
    }),
    //ORM
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature(
      importModules(join(__dirname, "./models/entity"), true, [
        "base.entity.js"
      ])
    ),
    //缓存 TODO redis缓存过期时间无效
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const cacheConfigResult: CacheModuleOptions = {
          ttl: 1000 * 60 * 60 * 24 * 7
        };
        const cacheConfig = configService.get<CacheConfig>("cache");
        if (cacheConfig.enableRedis) {
          const store = await redisStore({
            socket: {
              host: cacheConfig.redisHost,
              port: cacheConfig.redisPort
            },
            password: cacheConfig.redisPassword,
            database: cacheConfig.redisDatabase
          });
          cacheConfigResult.store = store as unknown as CacheStore;
        }
        return cacheConfigResult;
      },
      inject: [ConfigService]
    })
  ],
  controllers: importModules(join(__dirname, "./controllers"), true),
  //导入services
  providers: importModules(join(__dirname, "./service"), true)
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //为每个请求上下文派生EntityManager 详情参考https://mikro-orm.io/docs/installation#request-context
    consumer.apply(MikroOrmMiddleware).forRoutes("*");
  }
}
