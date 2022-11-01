import { Body, Controller, Get, Post } from "@nestjs/common";
import { Anonymous } from "src/common/decorators/anonymous.decorator";
import { Authentication } from "src/common/decorators/authentication.decorator";
import { LoginDto } from "src/models/dto/auth/login.dto";
import { AuthService } from "src/service/auth.service";

@Authentication()
@Controller("admin/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Anonymous()
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Anonymous()
  @Post("refreshToken")
  refreshToken(@Body("accessToken") accessToken: string) {
    return this.authService.refreshToken(accessToken);
  }

  @Anonymous()
  @Get("captchaImg")
  getCaptchaImg() {
    return this.authService.getCaptchaImg();
  }
}
