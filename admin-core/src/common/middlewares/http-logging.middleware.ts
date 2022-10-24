import { Logger } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

const _log = new Logger(HttpLoggingMiddleware.name);

export function HttpLoggingMiddleware(
  request: FastifyRequest,
  res: FastifyReply,
  next: Function
) {
  const requestData = request.method === "GET" ? request.query : request.body;

  _log.log(`
  http-method:${request.method}\t http-url:${request.url}
  requestData=${JSON.stringify(requestData, null, 2)}`);

  next();
}
