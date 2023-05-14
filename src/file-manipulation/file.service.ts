import {Injectable, Logger} from "@nestjs/common";
import {File} from "../data-base/entity/file.entity";
import {DataBaseFileService} from "../data-base/file/data-base.file.service";
import {FileStreamDto} from "../data-base/dto/file.dto";

@Injectable()
export class FileService {
  private readonly logger: Logger
  constructor(private readonly dbFileService: DataBaseFileService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, parentFolderId: string): Promise<File> {
    return await this.dbFileService.uploadFile(upFile, parentFolderId)
  }

  async downloadFile(fileId: string):Promise<FileStreamDto> {
    return await this.dbFileService.downloadFile(fileId)
  }

  async deleteFile(fileId: string) {
    return await this.dbFileService.deleteFile(fileId)
  }
}