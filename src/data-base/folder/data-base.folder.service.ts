import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {Repository} from "typeorm";
import MyError from "../../MyError/my.error";
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
    try {
      const user: User = await this.userService.getUserByName(userName)
      const parentFolder: Folder = await this.folderRepository.findOne({
        where: {
          owner: user,
          id: parentFolderId
        }, relations: {
          folders: true
        }
      });
      if (!parentFolder) {
        throw new HttpException('You have no rights to manipulate this folder', HttpStatus.BAD_REQUEST)
      }
      const isFolderExist: Folder = parentFolder.folders.find(f => f.name === folderName);

      if (!isFolderExist) {
        const folder: Folder = this.folderRepository.create({name: folderName, parent_folder: parentFolder, owner: user});
        const {id} = await this.folderRepository.save(folder);
        folder.path = `/user/folder/${id}`
        await this.folderRepository.save(folder)
        delete folder.owner
        return folder;
      }
      MyError.throwError('A folder with this name already exists in this folder');
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
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

  async getFolder(folderId: string): Promise<ReturnFolderDto> {
    try {
      const folder: Folder = await this.findFolder(folderId, true)
      return {
        folderId: folder.id,
        folders: folder.folders,
        files: folder.files
      }
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException('Folder not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFolder(folderId: string, userName: string): Promise<HttpStatus.NO_CONTENT> {
    const folder: Folder = await this.folderRepository.findOne({
      where: {
        id: folderId,
        owner: {
          userName
        }
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

  private async findFolder(folderId: string, relations: boolean): Promise<Folder> {
    if (relations) {
      return await this.folderRepository.findOne({
        where: {
          id: folderId
        },
        relations: {
          folders: true,
          files: true,
        }
      });
    } else {
      return await this.folderRepository.findOne({
        where: {
          id: folderId
        }
      });
    }
  }

  private async deleteFoldersRecursively(folder: Folder) {
    const folders: Folder[] = folder.folders;
    const files: File[] = folder.files;
    if (files) {
      for (const file of files) {
        await this.fileService.deleteFile(file.id);
      }
    }
    if (folders) {
      for (const folder1 of folders) {
        await this.deleteFolder(folder1.id, folder1.owner.userName);
      }
    }
    await this.folderRepository.remove(folder);
  }
}