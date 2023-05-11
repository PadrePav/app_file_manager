import {IsNotEmpty, IsString, MinLength} from "class-validator";

class UserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

export default UserDto