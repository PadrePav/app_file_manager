import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

class FolderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  folderName: string;
}

export default FolderDto