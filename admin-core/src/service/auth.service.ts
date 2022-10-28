import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { CacheKey } from "src/common/constants/cache.constant";
import { md5 } from "src/common/utils/encrypt.util";
import { LoginDto } from "src/models/dto/auth/login.dto";
import { AdminUser } from "src/models/entity/admin/admin-user.entity";
import { MenuService } from "./menu.service";
import { IJwtTokenPayload } from "src/models/jwt-token-payload";
import { ResultMsg, ResultStatusCode } from "src/models/result-msg";
import { ConfigService } from "src/config/config.service";
import { JwtConfig } from "src/config/config.model";
import { omit } from "lodash";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly menuService: MenuService,
    @InjectRepository(AdminUser)
    private readonly adminUserRepo: EntityRepository<AdminUser>
  ) {}

  /**
   * 从缓存获取用户权限
   * @param uid 用户ID
   * @returns
   */
  async getPermsByIdFromCache(uid: number): Promise<string[]> {
    let result = await this.cacheManager.get(CacheKey.ADMIN_PERMS + uid);
    if (!result) {
      return [];
    } else {
      return JSON.parse(result as string);
    }
  }

  /**
   * 生成token，存入缓存，并返回客户端结果
   * @param jwtPayload
   * @returns
   */
  async generateToken(jwtPayload: IJwtTokenPayload) {
    const longExpiresIn =
      this.configService.get<JwtConfig>("jwt").longExpiresIn;
    //获取Token最长过期时间点
    const longExpiresInDateTime = new Date();
    longExpiresInDateTime.setSeconds(
      longExpiresInDateTime.getSeconds() + longExpiresIn
    );

    //构建客户端结果
    const resp = {
      accessToken: await this.jwtService.signAsync(jwtPayload),
      expiresIn: longExpiresInDateTime.getTime()
    };

    //将客户端结果对象存入缓存
    await this.cacheManager.set(
      CacheKey.ADMIN_TOKEN + resp.accessToken,
      resp.accessToken,
      longExpiresIn
    );

    return resp;
  }

  async login(loginDto: LoginDto) {
    const adminUser = await this.adminUserRepo.findOne({
      userName: loginDto.userName
    });
    //验证用户名密码
    if (adminUser === null) {
      throw new HttpException("用户名或密码错误", HttpStatus.UNAUTHORIZED);
    }
    if (md5(adminUser.password + loginDto.timestamp) !== loginDto.password) {
      throw new HttpException("用户名或密码错误", HttpStatus.UNAUTHORIZED);
    }
    //获取用户权限字符串并缓存
    const perms = await this.menuService.getPerms(adminUser.role.id);
    await this.cacheManager.set(
      CacheKey.ADMIN_PERMS + adminUser.id,
      JSON.stringify(perms.map((i) => i.replaceAll(":", "/")))
    );

    //构建token并缓存
    const result = await this.generateToken({
      uid: adminUser.id
    });
    return result;
  }

  async refreshToken(oldToken: string) {
    if (!oldToken) {
      throw new BadRequestException();
    }
    //从缓存获取上一次该用户存入的token
    const tokenFromCache = await this.cacheManager.get(
      CacheKey.ADMIN_TOKEN + oldToken
    );
    if (tokenFromCache) {
      //从缓存删除旧token
      this.cacheManager.del(CacheKey.ADMIN_TOKEN + oldToken);
      let jwtPayload: IJwtTokenPayload;
      try {
        //验证旧token是否合法
        jwtPayload = await this.jwtService.verifyAsync(oldToken, {
          ignoreExpiration: true,
          complete: true
        });
      } catch (error) {
        throw new UnauthorizedException(
          new ResultMsg({
            code: ResultStatusCode.登录状态已过期,
            message: "token验证失败,请重新登录"
          })
        );
      }

      //验证成功并返回新token
      return await this.generateToken(
        omit(jwtPayload, ["iat", "exp"]) as IJwtTokenPayload
      );
    } else {
      throw new UnauthorizedException(
        new ResultMsg({
          code: ResultStatusCode.登录状态已过期,
          message: "登录状态已过期"
        })
      );
    }
  }
}
