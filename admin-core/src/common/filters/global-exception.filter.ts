import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
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

    let responseData = new ResultMsg({
      code,
      message: ConfigService.isDevelopment
        ? `${exception}`
        : "服务器异常,请联系管理员",
    });

    if (code >= 500) {
      this._log.error(exception.message, exception.stack);
    }

    response.status(code).send(responseData);
  }
}
