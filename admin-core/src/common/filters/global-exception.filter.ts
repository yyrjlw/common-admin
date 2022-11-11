import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { ResultMsg } from "src/models/result-msg";
import { FastifyReply } from "fastify";
import { ConfigService } from "src/config/config.service";

export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly _log = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseData = new ResultMsg();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      //如果异常返回体是ResultMsg的实例，则直接赋值给最终结果变量
      if (response instanceof ResultMsg) {
        responseData = response;
      } else if (typeof response === "string") {
        //如果异常返回体是字符串，则直接赋值给最终结果变量的message属性
        responseData.message = exception.message;
      }
    }

    if (code >= 500) {
      this._log.error(exception.message, exception.stack);
      responseData.message = ConfigService.isDevelopment
        ? `${exception}`
        : "服务器异常,请联系管理员";
    }

    response.status(code).send(responseData);
  }
}
