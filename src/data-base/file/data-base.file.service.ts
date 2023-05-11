import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {File} from "../entity/file.entity";
import {Repository} from "typeorm";
import {MinioClientService} from "../../minio-clinet/minio-client.service";
import {Folder} from "../entity/folder.entity";
import PostgresErrorCode from "../../auth/error-handler-ps/postgress.error";

@Injectable()
export class DataBaseFileService {
  private readonly logger: Logger
  constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>,
              @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>,
              private readonly minioService: MinioClientService) {
    this.logger = new Logger('FileService')
  }

  async uploadFile(upFile: Express.Multer.File, parentFolderId: string): Promise<File> {
    // const name = upFile.originalname.substring(
    //   0,
    //   upFile.originalname.lastIndexOf('.')
    // );
    // this.fileRepository.findOne({
    //   where: {
    //     name,
    //     parent_folder: parentFolderId
    //   }
    // })
    const file = await this.minioService.uploadFile(upFile)
    try {
      const parentFolder = await this.folderRepository.findOne({
        where: {
          folderId: parentFolderId
        },
        relations: {
          files: true
        }
      });
      const newFile = await this.fileRepository.create({...file, parent_folder: parentFolder})
      parentFolder.files = [newFile];
      await this.fileRepository.save(newFile);
      await this.folderRepository.save(parentFolder);
      return newFile;
    } catch (e) {
      if (e?.code === PostgresErrorCode.NotFound) {
        throw new HttpException('The folder where you were going to upload the file does not exist', HttpStatus.NOT_FOUND)
      }
      this.logger.log(e.message)
      throw new HttpException('An error occurred when adding to the database', HttpStatus.BAD_REQUEST)
    }
  }
}