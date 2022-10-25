import { Controller, Get, Post } from "@nestjs/common";

@Controller("auth")
export default class AuthController {
  @Post("login")
  login() {
    return "hello";
  }
}
