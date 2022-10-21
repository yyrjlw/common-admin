import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { Level } from "pino";

export class ConfigModel {
  @IsInt()
  @Type(() => Number)
  port: number = 3000;

  logLevel: Level = "debug";
}
