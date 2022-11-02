import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Anonymous } from "src/common/decorators/anonymous.decorator";
import { Authentication } from "src/common/decorators/authentication.decorator";

@ApiTags("account")
@Authentication()
@Controller("admin/account")
export class AccountController {
  @Get()
  getHello() {
    return "hello";
  }
}
