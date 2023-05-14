import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ReturnAuthDto {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  token:string;
}