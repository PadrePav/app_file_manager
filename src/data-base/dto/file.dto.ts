import * as Stream from "stream";

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