import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class AuthDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
