import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {MinioService} from "nestjs-minio-client";
import {ConfigService} from "@nestjs/config";
import {v4 as uuidv4} from "uuid";
import {FileDto} from "../data-base/dto/file.dto";

@Injectable()
export class MinioClientService {

  private readonly bucketName = this.configService.get('MINIO_BUCKET_NAME')
  private readonly logger = new Logger('MinioService')

  constructor(private readonly minio: MinioService,
              private readonly configService: ConfigService) {}

  get client() {
    return this.minio.client;
  }

  async uploadFile(file: Express.Multer.File): Promise<FileDto> {
    const uid: string = uuidv4() + file.originalname
    try {
      await this.client.putObject(
        this.bucketName,
        uid,
        file.buffer,
      );
      const name = file.originalname.substring(
        0,
        file.originalname.lastIndexOf('.')
      );
      const type = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length
      );
      return {
        name,
        uid,
        type,
        size: file.size
      }
    } catch (e) {
      this.logger.log(e.message)
      throw new HttpException('An error occurred while downloading the file', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteFile(filename: string): Promise<HttpStatus.OK> {
    try {
      await this.client.removeObject(this.bucketName, filename);
      return HttpStatus.OK
    } catch (e) {
      this.logger.log(e.message)
      throw new HttpException('An error occurred when deleting a file', HttpStatus.NOT_FOUND)
    }
  }
}
