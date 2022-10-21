import { Controller, Get } from "@nestjs/common";

@Controller("admin/account")
export default class AccountController {
  @Get()
  getHello() {
    return "hello";
  }
}
