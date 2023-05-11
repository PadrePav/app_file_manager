import {Global, Module} from "@nestjs/common";
import {DataBaseFileService} from "./data-base.file.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {File} from "../entity/file.entity";
import {MinioClientService} from "../../minio-clinet/minio-client.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, File])
  ],
  providers: [DataBaseFileService],
  exports: [DataBaseFileService]
})
export class DataBaseFileModule {}