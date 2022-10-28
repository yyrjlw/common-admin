import { Controller, Get } from "@nestjs/common";
import { Anonymous } from "src/common/decorators/anonymous.decorator";
import { Authentication } from "src/common/decorators/authentication.decorator";

@Authentication()
@Controller("admin/account")
export class AccountController {
  @Get()
  getHello() {
    return "hello";
  }
}
