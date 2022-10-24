import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { map } from "rxjs";
import { ResultMsg } from "src/models/result-msg";

/**
 * 转换api接口返回结果为ResultMsg的实例
 */
export class ApiTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<FastifyReply>();
        response.header("Content-Type", "application/json; charset=utf-8");
        return ResultMsg.ok(data);
      })
    );
  }
}
