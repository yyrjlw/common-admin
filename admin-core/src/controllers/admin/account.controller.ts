import { Controller, Get } from "@nestjs/common";

@Controller("account")
export default class AccountController {
  @Get()
  getHello() {
    return "hello";
  }
}
