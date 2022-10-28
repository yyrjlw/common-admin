import { MikroORM } from "@mikro-orm/core";
import { MikroOrmMiddleware } from "@mikro-orm/nestjs";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication
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
  //设置全局dto数据验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //删除掉请求内容没有在dto中声明的属性
      transform: true //自动类型转换
    })
  );

  //开启监听程序终止，以便mikro-orm关闭数据库连接
  app.enableShutdownHooks();

  const port = configService.get("port");

  await app.listen(port);
  log.log(`应用启动成功!URL:http://localhost:${port}`);
}

bootstrap();
