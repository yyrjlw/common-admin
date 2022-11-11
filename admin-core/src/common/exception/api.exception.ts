import { HttpException } from "@nestjs/common";
import { ResultMsg } from "src/models/result-msg";

export class ApiException extends HttpException {
  constructor(errData: Partial<ResultMsg>) {
    super(new ResultMsg(errData), 200);
  }
}
