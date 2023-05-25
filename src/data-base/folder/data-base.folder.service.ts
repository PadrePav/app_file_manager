import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {Repository} from "typeorm";
import ReturnFolderDto, {PathParentFolderDto} from "../dto/return.folder.dto";
import {DataBaseFileService} from "../file/data-base.file.service";
import {User} from "../entity/user.entity";
import {File} from "../entity/file.entity";
import {DataBaseUsersService} from "../user/data-base.users.service";


@Injectable()
export class DataBaseFolderService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>,
    private readonly userService: DataBaseUsersService,
    private readonly fileService: DataBaseFileService
  ) {
    this.logger = new Logger('DataBaseFolderService')
  }

  async createFolder(folderName: string, parentFolderId: string, userName: string): Promise<Folder> {
    const user: User = await this.dataValidityCheckAndReturnUser(parentFolderId, userName, true)
    const parentFolder: Folder = await this.folderRepository.findOne({
      where: {
        id: parentFolderId
      }, relations: {
        folders: true
      }
    });
    const existedFolder: Folder = parentFolder.folders.find(f => f.name === folderName);
    if (existedFolder) {
      throw new HttpException('A folder with this name already exists in this folder', HttpStatus.BAD_REQUEST)
    }
    const folder: Folder = this.folderRepository.create({name: folderName, parent_folder: parentFolder, owner: user});
    const {id} = await this.folderRepository.save(folder);
    folder.path = `/user/folder/${id}`
    await this.folderRepository.save(folder)
    delete folder.owner
    return folder;
  }

  async pathToParentFolder(folderId: string): Promise<PathParentFolderDto[]> {
    const folder = await this.folderRepository.findOne({
      where: {
        id: folderId
      },
      relations: {
        parent_folder: true
      }
    })
    if (!folder) {
      throw new HttpException('There is no such folder', HttpStatus.BAD_REQUEST)
    }
    const pathways: PathParentFolderDto[] = [{path: folder.path, folderName: folder.name}]
    let parentFolder: Folder = folder
    while (true) {
      const tempParent = await this.folderRepository.findOne({
        where: {
          id: parentFolder.parent_folder.id
        },
        relations: {
          parent_folder: true
        }
      })
      if (!tempParent.parent_folder) {
        pathways.push({path: tempParent.path, folderName: tempParent.name})
        break
      }
      parentFolder = tempParent
      pathways.push({path: `/user/folder/${tempParent.id}`, folderName: tempParent.name})
    }
    return pathways.reverse()

  }

  async getFolder(folderId: string, userName: string): Promise<ReturnFolderDto> {
    await this.dataValidityCheckAndReturnUser(folderId, userName, false)
    const folder: Folder = await this.folderRepository.findOne({
      where: {
        id: folderId
      },
      relations: {
        folders: true,
        files: true,
      }
    });
    return {
      folderId: folder.id,
      folders: folder.folders,
      files: folder.files
    }
  }

  async deleteFolder(folderId: string, userName: string): Promise<HttpStatus.NO_CONTENT> {
    await this.dataValidityCheckAndReturnUser(folderId, userName, false)
    const folder: Folder = await this.folderRepository.findOne({
      where: {
        id: folderId,
      },
      relations: {
        folders: {
          owner: true
        },
        files: true,
        owner: true
      }
    });
    await this.deleteFoldersRecursively(folder);
    return HttpStatus.NO_CONTENT;
  }

  private async deleteFoldersRecursively(folderToDelete: Folder) {
    const folders: Folder[] = folderToDelete.folders;
    const files: File[] = folderToDelete.files;
    if (files) {
      for (const file of files) {
        await this.fileService.deleteFile(file.id, folderToDelete.owner.userName);
      }
    }
    if (folders) {
      for (const folder of folders) {
        await this.deleteFolder(folder.id, folder.owner.userName);
      }
    }
    await this.folderRepository.remove(folderToDelete);
  }

  private async dataValidityCheckAndReturnUser(folderId: string, userName: string, isParentFolder: boolean): Promise<User> {
    const existedParentFolder: Folder = await this.folderRepository.findOne({
      where: {
        id: folderId
      }
    });
    if (!existedParentFolder) {
      throw new HttpException(
        isParentFolder ?
        'The parent folder was not found' :
        "Folder not found",
        HttpStatus.NOT_FOUND
    )}
    const user: User = await this.userService.getUserByName(userName);
    const isFolderAccessible: Folder = await this.folderRepository.findOne({
      where: {
        id: folderId,
        owner: user
      }
    });
    if (!isFolderAccessible) {
      throw new HttpException('You have no rights to manipulate this folder', HttpStatus.BAD_REQUEST)
    }
    return user
  }
}