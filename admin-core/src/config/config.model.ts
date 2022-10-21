import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class ConfigModel {
  @IsInt()
  @Type(() => Number)
  port: number = 3000;

  logLevel: string = "debug";
}
