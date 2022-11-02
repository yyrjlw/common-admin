import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetCaptchaImgDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  height?: number;
}
