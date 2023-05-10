import {IsNotEmpty, IsString, MinLength} from "class-validator";

class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

export default UserDto