import {Module} from "@nestjs/common";
import {DataBaseFileService} from "./data-base.file.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {File} from "../entity/file.entity";
import {DataBaseUsersModule} from "../user/data-base.users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, File]),
    DataBaseUsersModule
  ],
  providers: [DataBaseFileService],
  exports: [DataBaseFileService]
})
export class DataBaseFileModule {}