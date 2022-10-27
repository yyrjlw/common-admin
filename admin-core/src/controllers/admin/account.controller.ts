import { Controller, Get } from "@nestjs/common";

@Controller("account")
export class AccountController {
  @Get()
  getHello() {
    return "hello";
  }
}
