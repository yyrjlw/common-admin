import { CACHE_MANAGER, Controller, Get, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Controller("test")
export class TestController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get()
  async get() {
    await this.cacheManager.set("a", 123);
    return this.cacheManager.get("a");
  }
}
