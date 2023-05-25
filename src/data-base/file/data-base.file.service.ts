import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {File} from "../entity/file.entity";
import {Repository} from "typeorm";
import {MinioClientService} from "../../minio-clinet/minio-client.service";
import {Folder} from "../entity/folder.entity";
import {v4 as uuidv4} from "uuid";
import {FileDto, FileStreamDto} from "../dto/file.dto";
import * as Stream from "stream";
import {User} from "../entity/user.entity";
import {DataBaseUsersService} from "../user/data-base.users.service";

@Injectable()
export class DataBaseFileService {
  private readonly logger: Logger
  constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>,
              @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>,
              private readonly userService: DataBaseUsersService,
              private readonly minioService: MinioClientService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, userName, parentFolderId): Promise<HttpStatus.CREATED> {
    const user: User = await this.userService.getUserByName(userName);
    const isFolderAccessible: Folder = await this.folderRepository.findOne({
      where: {
        id: parentFolderId,
        owner: user
      }
    });
    if (!isFolderAccessible) {
      throw new HttpException('You have no rights to manipulate this folder', HttpStatus.BAD_REQUEST)
    }
    const existedParenFolder: Folder = await this.folderRepository.findOne({
      where: {
        id: parentFolderId
      }
    });
    if (!existedParenFolder) {
      throw new HttpException('The folder where you were going to upload the file does not exist', HttpStatus.NOT_FOUND)
    }
    const parentFolder: Folder = await this.folderRepository.findOne({
      where: {
        id: parentFolderId
      },
      relations: {
        files: true
      }
    });
    const file: FileDto = this.parseFileName(upFile.originalname);
    const existedFile: File = parentFolder.files.find(f => f.name === file.name && f.type === file.type);

    if (existedFile) {
      throw new HttpException('A file with this name already exists in this folder', HttpStatus.BAD_REQUEST)
    }
    await this.minioService.uploadFile({
      filename: file.uid,
      buffer: upFile.buffer
    });
    const newFile: File = this.fileRepository.create({
      ...file,
      size: upFile.size,
      parent_folder: parentFolder,
      owner: user
    });
    const {id} = await this.fileRepository.save(newFile);
    newFile.path = `/user/folder/${id}`
    await this.fileRepository.save(newFile);
    return HttpStatus.CREATED;
  }

  private parseFileName(filename: string): FileDto {
    const name: string = filename.substring(
      0,
      filename.lastIndexOf('.')
    );
    const type: string = filename.substring(
      filename.lastIndexOf('.'),
      filename.length
    );
    const uid: string = uuidv4() + filename
    return {
      name,
      type,
      uid,
      size: null
    };
  }

  async downloadFile(fileId: string, userName: string):Promise<FileStreamDto> {
    const user: User = await this.userService.getUserByName(userName);
    const file: File = await this.fileRepository.findOne({
      where: {
        id: fileId,
        owner: user
      }
    });
    if (!file) {
      throw new HttpException('You have no rights to manipulate this file', HttpStatus.BAD_REQUEST)
    }
    console.log(file)
    const stream: Stream = await this.minioService.downloadFile(file.uid)
    return {
      filename: file.name + file.type,
      stream
    }
  }

  async deleteFile(fileId: string, userName: string): Promise<HttpStatus.NO_CONTENT> {
    const user: User = await this.userService.getUserByName(userName);
    const isFileAccessible: File = await this.fileRepository.findOne({
      where: {
        id: fileId,
        owner: user
      }
    });
    if (!isFileAccessible) {
      throw new HttpException('You have no rights to manipulate this file', HttpStatus.BAD_REQUEST)
    }
    const file: File = await this.fileRepository.findOne({
      where: {
        id: fileId,
        owner: user
      }
    });
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND)
    }
    await this.minioService.deleteFile(file.uid);
    await this.fileRepository.remove(file);
    return HttpStatus.NO_CONTENT;
  }
}