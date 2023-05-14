import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {MinioService} from "nestjs-minio-client";
import {ConfigService} from "@nestjs/config";
import {MinioFileDto} from "./dto/minio-client.dto";
import * as Stream from "stream";

@Injectable()
export class MinioClientService {

  private readonly bucketName = this.configService.get('MINIO_BUCKET_NAME')
  private readonly logger = new Logger('MinioService')

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService
  ) {}

  get client() {
    return this.minio.client;
  }

  async uploadFile(file: MinioFileDto): Promise<void> {
    await this.client.putObject(
      this.bucketName,
      file.filename,
      file.buffer,
    );
  }

  async downloadFile(filename: string): Promise<Stream> {
    try {
      return await this.client.getObject(this.bucketName, filename)
    } catch (e) {
      this.logger.log(e.message);
      //Figure out how to handle errors
    }
  }

  async deleteFile(filename: string): Promise<HttpStatus.OK> {
    try {
      await this.client.removeObject(this.bucketName, filename);
      return HttpStatus.OK;
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException('An error occurred when deleting a file', HttpStatus.NOT_FOUND);
    }
  }
}
