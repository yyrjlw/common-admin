import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ADMIN_PERMS } from "src/common/constants/cache.constant";
import { LoginDto } from "src/models/dto/auth/login.dto";
import { AdminUser } from "src/models/entity/admin/admin-user.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AdminUser)
    private readonly adminUserRepo: EntityRepository<AdminUser>
  ) {}

  /**
   * 从缓存获取用户权限
   * @param uid 用户ID
   * @returns
   */
  async getPermsByIdFromCache(uid: number): Promise<string[]> {
    let result = await this.cacheManager.get(ADMIN_PERMS + uid);
    if (!result) {
      return [];
    } else {
      return JSON.parse(result as string);
    }
  }

  async login(loginDto: LoginDto) {
    const adminUser = await this.adminUserRepo.findOne({
      userName: loginDto.userName,
    });
    if (adminUser === null) {
    }
  }
}
