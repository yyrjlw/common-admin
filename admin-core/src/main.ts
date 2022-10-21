import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filter/global-exception.filter";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./share/service/logger.service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  const log = app.get(LoggerService);
  app.useLogger(log);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get("port");

  await app.listen(port);
  log.log(`应用启动成功!URL:http://localhost:${port}`);
}

bootstrap();
