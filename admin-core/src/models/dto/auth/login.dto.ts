import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";
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
}
