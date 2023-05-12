import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {File} from "../entity/file.entity";
import {Repository} from "typeorm";
import {MinioClientService} from "../../minio-clinet/minio-client.service";
import {Folder} from "../entity/folder.entity";
import PostgresErrorCode from "../../auth/error-handler-ps/postgress.error";
import MyError from "../../MyError/my.error";
import {v4 as uuidv4} from "uuid";
import {FileDto} from "../dto/file.dto";

@Injectable()
export class DataBaseFileService {
  private readonly logger: Logger
  constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>,
              @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>,
              private readonly minioService: MinioClientService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, parentFolderId: string): Promise<File> {
    try {
      const file = this.parseFile(upFile.originalname)
      const parentFolder = await this.folderRepository.findOne({
        where: {
          folderId: parentFolderId
        },
        relations: {
          files: true
        }
      });

      // const fileExist = await this.folderRepository
      //   .createQueryBuilder('folder')
      //   .leftJoinAndSelect('folder.files', 'file')
      //   .where('folder.folderId = :parentFolderId', { parentFolderId })
      //   .andWhere('file.name = :name', { name: file.name })
      //   .andWhere('file.type = :type', { type: file.type })
      //   .getOne()

      const fileExist = parentFolder.files.find(f => f.name === file.name && f.type === file.type)

      if (!fileExist) {
        await this.minioService.uploadFile({
          filename: file.uid,
          buffer: upFile.buffer
        })
        const newFile = this.fileRepository.create({...file, size: upFile.size, parent_folder: parentFolder})
        const files: File[] = parentFolder.files;
        files.push(newFile)
        parentFolder.files = files
        await this.fileRepository.save(newFile);
        await this.folderRepository.save(parentFolder);
        return newFile;
      }
      MyError.create('A file with this name already exists in this folder')
    } catch (e) {
      if (e?.code === PostgresErrorCode.NotFound) {
        throw new HttpException('The folder where you were going to upload the file does not exist',
          HttpStatus.NOT_FOUND)
      } else if (e?.code === 555) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }
      this.logger.log(e)
      throw new HttpException('An error occurred when adding to the database', HttpStatus.BAD_REQUEST)
    }
  }

  private parseFile(filename: string): FileDto {
    const name = filename.substring(
      0,
      filename.lastIndexOf('.')
    );
    const type = filename.substring(
      filename.lastIndexOf('.'),
      filename.length
    );
    const uid: string = uuidv4() + filename
    return {
      name,
      type,
      uid,
      size: null
    }
  }

  async deleteFile(fileId: string): Promise<HttpStatus.OK> {
    try {
      const file = await this.fileRepository.findOne({
        where: {
          fileId
        }
      })
      if (file) {
        console.log(file.uid, 'db')
        await this.minioService.deleteFile(file.uid)
        await this.fileRepository.remove(file)
        return HttpStatus.OK
      }
      MyError.create('File not found')
    } catch (e) {
      if (e?.code === 555) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }
      this.logger.log(e.message)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST)
    }
  }
}