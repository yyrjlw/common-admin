import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filter/global-exception.filter";
import { ApiTransformInterceptor } from "./common/interceptor/api-response-transform.interceptor";
import { HttpLoggingMiddleware } from "./common/middleware/http-logging.middleware";
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
  app.setGlobalPrefix("api");
  //统一API返回结果类型
  app.useGlobalInterceptors(new ApiTransformInterceptor());

  const port = configService.get("port");

  await app.listen(port);
  log.log(`应用启动成功!URL:http://localhost:${port}`);
}

bootstrap();
