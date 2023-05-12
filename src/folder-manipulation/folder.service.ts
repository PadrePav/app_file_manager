import {Injectable} from "@nestjs/common";
import {DataBaseFolderService} from "../data-base/folder/data-base.folder.service";

@Injectable()
export class FolderService {
  constructor(private readonly dbFolderService: DataBaseFolderService) {}

  async createFolder(folderName: string, parentFolderId: string) {
    return await this.dbFolderService.createFolder(folderName, parentFolderId)
  }

  async openFolder(folderId: string) {
    return await this.dbFolderService.openFolder(folderId)
  }

  async deleteFolder(folderId: string) {
    return await this.dbFolderService.deleteFolder(folderId)
  }
}