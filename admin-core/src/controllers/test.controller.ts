import {
  BadRequestException,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Logger
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { ResultMsg } from "src/models/result-msg";
import { AuthService } from "src/service/auth.service";

@Controller("test")
export class TestController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService
  ) {}

  @Get()
  async get() {
    console.log(await this.authService.getPermsByIdFromCache(1));

    return this.cacheManager.get("a");
  }
}
