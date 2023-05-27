import {HttpStatus, Injectable, Logger} from "@nestjs/common";
import {DataBaseFileService} from "../data-base/file/data-base.file.service";
import {FileStreamDto} from "../data-base/dto/file.dto";
import {File} from "../data-base/entity/file.entity";

@Injectable()
export class FileService {
  private readonly logger: Logger
  constructor(private readonly dbFileService: DataBaseFileService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, userName: string, parentFolderId: string): Promise<File> {
    return await this.dbFileService.uploadFile(upFile, userName, parentFolderId);
  }

  async downloadFile(fileId: string, userName: string):Promise<FileStreamDto> {
    return await this.dbFileService.downloadFile(fileId, userName);
  }

  async deleteFile(fileId: string, userName: string): Promise<HttpStatus.NO_CONTENT> {
    return await this.dbFileService.deleteFile(fileId, userName);
  }
}