import {HttpStatus, Injectable} from "@nestjs/common";
import {DataBaseFolderService} from "../data-base/folder/data-base.folder.service";
import {Folder} from "../data-base/entity/folder.entity";
import ReturnFolderDto from "../data-base/dto/return.folder.dto";

@Injectable()
export class FolderService {
  constructor(private readonly dbFolderService: DataBaseFolderService) {}

  async createFolder(folderName: string, parentFolderId: string): Promise<Folder> {
    return await this.dbFolderService.createFolder(folderName, parentFolderId)
  }

  async openFolder(folderId: string): Promise<ReturnFolderDto> {
    return await this.dbFolderService.openFolder(folderId)
  }

  async deleteFolder(folderId: string): Promise<HttpStatus.NO_CONTENT> {
    return await this.dbFolderService.deleteFolder(folderId)
  }

  pathToParentFolder(folderId: string) {
    return this.dbFolderService.pathToParentFolder(folderId)
  }
}