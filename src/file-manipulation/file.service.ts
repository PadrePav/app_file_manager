import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {File} from "../data-base/entity/file.entity";
import {DataBaseFileService} from "../data-base/file/data-base.file.service";

@Injectable()
export class FileService {
  private readonly logger: Logger
  constructor(private readonly dbFileService: DataBaseFileService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, parentFolderId: string): Promise<File> {
    return await this.dbFileService.uploadFile(upFile, parentFolderId)
  }
}