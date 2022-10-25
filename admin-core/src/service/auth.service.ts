import { Injectable } from "@nestjs/common";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ADMIN_PERMS } from "src/common/constants/cache.constant";

@Injectable()
export default class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getPermsByIdFromCache(uid: number): Promise<string[]> {
    let result = await this.cacheManager.get(ADMIN_PERMS + uid);
    if (!result) {
      return [];
    } else {
      return JSON.parse(result as string);
    }
  }
}
