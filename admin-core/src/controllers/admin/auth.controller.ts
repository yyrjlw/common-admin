import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Anonymous } from "src/common/decorators/anonymous.decorator";
import { Authentication } from "src/common/decorators/authentication.decorator";
import { PermissionOptional } from "src/common/decorators/permission-optional.decorator";
import { UserProfile } from "src/common/decorators/user-profire.param-decorator";
import { GetCaptchaImgDto } from "src/models/dto/auth/get-captcha-img.dto";
import { LoginDto } from "src/models/dto/auth/login.dto";
import { IJwtTokenPayload } from "src/models/jwt-token-payload";
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

  /**
   * 获取用户角色菜单&权限
   * @param userProfile
   */
  @PermissionOptional()
  @Get("permmenu")
  permmenu(@UserProfile() userProfile: IJwtTokenPayload) {
    return this.authService.getPermmenu(userProfile);
  }
}
