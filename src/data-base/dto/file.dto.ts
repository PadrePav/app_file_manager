import * as Stream from "stream";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class FileDto {
  name: string;

  uid: string;

  type: string;

  size: number;
}

export class FileStreamDto {
  filename: string;
  stream: Stream;
}