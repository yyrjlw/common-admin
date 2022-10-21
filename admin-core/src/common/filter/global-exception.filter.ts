import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ResultMsg } from "src/model/result-msg.model";
import { FastifyReply } from "fastify";
import { ConfigService } from "src/config/config.service";

export class GlobalExceptionFilter implements ExceptionFilter {
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
      //this.log.error(exception, GlobalExceptionFilter.name);
    }

    response.status(code).send(responseData);
  }
}
