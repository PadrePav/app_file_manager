import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {MinioService} from "nestjs-minio-client";
import {ConfigService} from "@nestjs/config";
import {MinioFileDto} from "./dto/minio-client.dto";

@Injectable()
export class MinioClientService {

  private readonly bucketName = this.configService.get('MINIO_BUCKET_NAME')
  private readonly logger = new Logger('MinioService')

  constructor(private readonly minio: MinioService,
              private readonly configService: ConfigService) {}

  get client() {
    return this.minio.client;
  }

  async uploadFile(file: MinioFileDto): Promise<HttpStatus.OK | HttpStatus.BAD_REQUEST> {
    try {
      await this.client.putObject(
        this.bucketName,
        file.filename,
        file.buffer,
      );
      return HttpStatus.OK
    } catch (e) {
      this.logger.log(e.message)
      return HttpStatus.BAD_REQUEST
    }
  }

  async deleteFile(filename: string): Promise<HttpStatus.OK | HttpStatus.BAD_REQUEST> {
    try {
      await this.client.removeObject(this.bucketName, filename);
      return HttpStatus.OK
    } catch (e) {
      this.logger.log(e.message)
      return HttpStatus.BAD_REQUEST
    }
  }
}
