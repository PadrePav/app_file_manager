import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {Repository} from "typeorm";
import MyError from "../../MyError/my.error";
import ReturnFolderDto from "../dto/return.folder.dto";
import {DataBaseFileService} from "../file/data-base.file.service";
import {User} from "../entity/user.entity";
import {File} from "../entity/file.entity";


@Injectable()
export class DataBaseFolderService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly fileService: DataBaseFileService
  ) {
    this.logger = new Logger('DataBaseFolderService')
  }

  async createFolder(folderName: string, parentFolderId: string): Promise<Folder> {
    try {
      const parentFolder: Folder = await this.findFolder(parentFolderId);
      const folderExist: Folder = parentFolder.folders.find(f => f.name === folderName);

      if (!folderExist) {
        const folder: Folder = this.folderRepository.create({name: folderName, parent_folder: parentFolder});
        await this.folderRepository.save(folder);
        console.log(parentFolder);
        return folder;
      }
      MyError.create('A folder with this name already exists in this folder');
    } catch (e) {
      if (e.code === 555) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
      this.logger.log(e.message);
      throw new HttpException('There was an error when creating the folder', HttpStatus.BAD_REQUEST);
    }
  }



  async openFolder(folderId: string): Promise<ReturnFolderDto> {
    try {
      const folder: Folder = await this.findFolder(folderId)
      return {
        folders: folder.folders,
        files: folder.files
      }
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException('Folder not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFolder(folderId: string): Promise<HttpStatus.NO_CONTENT> {
    const folder: Folder = await this.findFolder(folderId);
    await this.deleteFoldersRecursively(folder);
    return HttpStatus.NO_CONTENT;
  }

  private async findFolder(folderId: string): Promise<Folder> {
    return await this.folderRepository.findOne({
      where: {
        folderId
      },
      relations: {
        folders: true,
        files: true,
      }
    });
  }

  private async deleteFoldersRecursively(folder: Folder) {
    const folders: Folder[] = folder.folders;
    const files: File[] = folder.files;
    if (files) {
      for (const file of files) {
        await this.fileService.deleteFile(file.fileId);
      }
    }
    if (folders) {
      for (const folder1 of folders) {
        await this.deleteFolder(folder1.folderId);
      }
    }
    await this.folderRepository.remove(folder);
  }
}