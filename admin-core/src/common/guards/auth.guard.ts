import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import {
  ANONYMOUS,
  PERMISSIONOPTIONAL
} from "../constants/decorator-metedata.constant";
import { isEmpty } from "lodash";
import { REQUEST_KEY_USER_PROFILE } from "../decorators/user-profire.param-decorator";
import { AuthService } from "src/service/auth.service";
import { IJwtTokenPayload } from "src/models/jwt-token-payload";
import { ConfigService } from "src/config/config.service";
import { ApiException } from "../exception/api.exception";
import { ResultStatusCode } from "src/models/result-msg";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jtwService: JwtService,
    private authService: AuthService,
    private configService: ConfigService
  ) {}
  async canActivate(context: ExecutionContext) {
    //如果控制器被装饰为anonymous，则跳过所有验证
    const anonymous = this.reflector.get(ANONYMOUS, context.getHandler());
    if (anonymous) {
      return true;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const path = request.url.split("?")[0];

    //验证token
    let token = request.headers["authorization"];
    if (!token) {
      throw new UnauthorizedException();
    }
    token = token.slice("Bearer ".length);
    let userProfile: IJwtTokenPayload;
    try {
      userProfile = await this.jtwService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException();
    }
    if (isEmpty(userProfile)) {
      throw new UnauthorizedException();
    }
    //将用户信息挂载到request
    request[REQUEST_KEY_USER_PROFILE] = userProfile;

    //如果控制器被装饰为permissionOptional，则跳过权限验证
    const permissionOptional = this.reflector.get(
      PERMISSIONOPTIONAL,
      context.getHandler()
    );
    if (permissionOptional) {
      return true;
    }

    //获取用户权限
    const perms = await this.authService.getPermsByIdFromCache(userProfile.uid);

    //判断用户是否有权限当前访问的路由
    if (
      !perms.includes(
        path.replace(`/${this.configService.get("globalPrefix")}/`, "")
      )
    ) {
      throw new ApiException({
        code: ResultStatusCode.接口无权限,
        message: "您没有权限访问!"
      });
    }

    return true;
  }
}
