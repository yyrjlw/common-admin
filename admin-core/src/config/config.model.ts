import { LogLevel } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class ConfigModel {
  @IsInt()
  @Type(() => Number)
  port: number = 3000;

  logLevel: LogLevel[] = ["debug"];
}
