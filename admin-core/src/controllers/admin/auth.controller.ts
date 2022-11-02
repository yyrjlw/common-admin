import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Anonymous } from "src/common/decorators/anonymous.decorator";
import { Authentication } from "src/common/decorators/authentication.decorator";
import { GetCaptchaImgDto } from "src/models/dto/auth/get-captcha-img.dto";
import { LoginDto } from "src/models/dto/auth/login.dto";
import { AuthService } from "src/service/auth.service";

@ApiBearerAuth()
@ApiTags("Auth")
@Authentication()
@Controller("admin/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录
   * @param loginDto
   * @returns
   */
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
  getCaptchaImg(@Query() data: GetCaptchaImgDto) {
    return this.authService.getCaptchaImg(data);
  }
}
