import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsUUID } from "class-validator";
import dayjs from "dayjs";

export class LoginDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: dayjs().unix()
  })
  @IsInt()
  timestamp: number;

  @IsNotEmpty()
  captcha: string;

  @IsNotEmpty()
  captchaID: string;
}
