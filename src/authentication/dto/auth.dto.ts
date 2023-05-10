import {IsNotEmpty, IsString, MinLength} from "class-validator";

export default class AuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
