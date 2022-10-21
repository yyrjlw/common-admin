import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filter/global-exception.filter";
import { HttpLoggingMiddleware } from "./common/middleware/http-logging.middleware";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./share/service/logger.service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  //自定义日志Service
  const log = app.get(LoggerService);
  app.useLogger(log);
  //打印请求日志
  app.use(HttpLoggingMiddleware);
  //转换api异常响应
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get("port");

  await app.listen(port);
  log.log(`应用启动成功!URL:http://localhost:${port}`);
}

bootstrap();
