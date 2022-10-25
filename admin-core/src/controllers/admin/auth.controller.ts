import { Body, Controller, Get, Post } from "@nestjs/common";
import { LoginDto } from "src/models/dto/auth/login.dto";
import AuthService from "src/service/auth.service";

@Controller("auth")
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService;
  }
}
