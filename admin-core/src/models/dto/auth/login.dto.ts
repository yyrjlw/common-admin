import { IsInt, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  @IsInt()
  timestamp: number;
}
