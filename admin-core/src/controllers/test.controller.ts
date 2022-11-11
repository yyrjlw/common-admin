import {
  BadRequestException,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Logger
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { ApiException } from "src/common/exception/api.exception";
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
    throw new ApiException({
      code: 123,
      message: "asasa"
    });

    return this.cacheManager.get("a");
  }
}
