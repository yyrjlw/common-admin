import { Controller, Get } from "@nestjs/common";

@Controller("auth")
export default class AuthController {
  @Get()
  getHello() {
    return "hello";
  }
}
