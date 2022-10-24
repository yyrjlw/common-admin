import { LogLevel } from "@nestjs/common";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from "class-validator";

export class CacheConfig {
  @IsBoolean()
  enableRedis: boolean;

  @ValidateIf((o: CacheConfig) => o.enableRedis)
  @IsNotEmpty()
  redisHost: string;

  @ValidateIf((o: CacheConfig) => o.enableRedis)
  @IsInt()
  redisPort: number;

  redisPassword?: string;

  redisDatabase?: number;
}

export class ConfigModel {
  @IsInt()
  @Type(() => Number)
  port: number = 3000;

  @IsNotEmpty()
  globalPrefix: string;

  logLevel: LogLevel[] = ["debug"];

  @Type(() => CacheConfig)
  @ValidateNested()
  cache: CacheConfig;
}
