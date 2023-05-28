import {Injectable} from "@nestjs/common";
import {DataBaseFolderService} from "../data-base/folder/data-base.folder.service";
import {Folder} from "../data-base/entity/folder.entity";
import ReturnFolderDto from "../data-base/dto/return.folder.dto";

@Injectable()
export class FolderService {
  constructor(private readonly dbFolderService: DataBaseFolderService) {}

  async createFolder(folderName: string, parentFolderId: string, userName: string): Promise<Folder> {
    return await this.dbFolderService.createFolder(folderName, parentFolderId, userName)
  }

  async getFolder(folderId: string, userName: string): Promise<ReturnFolderDto> {
    return await this.dbFolderService.getFolder(folderId, userName)
  }

  async changeFolderName(folderName: string, folderId: string, userName: string) {
    return await this.dbFolderService.changeFolderName(folderName, folderId, userName)
  }

  async deleteFolder(folderId: string, userName: string) {
    return await this.dbFolderService.deleteFolder(folderId, userName)
  }

  pathToParentFolder(folderId: string) {
    return this.dbFolderService.pathToParentFolder(folderId)
  }
}