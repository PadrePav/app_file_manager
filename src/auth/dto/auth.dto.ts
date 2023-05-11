import {IsNotEmpty, IsString, MinLength} from "class-validator";

export default class AuthDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
