import { MikroORM } from "@mikro-orm/core";
import { MikroOrmMiddleware } from "@mikro-orm/nestjs";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ApiTransformInterceptor } from "./common/interceptors/api-response-transform.interceptor";
import { HttpLoggingMiddleware } from "./common/middlewares/http-logging.middleware";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get(ConfigService);

  //设置日志级别
  app.useLogger(configService.get("logLevel"));
  const log = new Logger(bootstrap.name);
  //打印请求日志
  app.use(HttpLoggingMiddleware);
  //转换api异常响应
  app.useGlobalFilters(new GlobalExceptionFilter());
  //设置全局api前缀
  app.setGlobalPrefix(configService.get("globalPrefix"));
  //统一API返回结果类型
  app.useGlobalInterceptors(new ApiTransformInterceptor());
  //为每个请求上下文派生EntityManager 详情参考https://mikro-orm.io/docs/installation#request-context
  // app.use(new MikroOrmMiddleware(app.get(MikroORM)));

  //开启监听程序终止，以便mikro-orm关闭数据库连接
  app.enableShutdownHooks();

  const port = configService.get("port");

  await app.listen(port);
  log.log(`应用启动成功!URL:http://localhost:${port}`);
}

bootstrap();
