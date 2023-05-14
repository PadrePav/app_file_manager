import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {DataBaseFolderService} from "./data-base.folder.service";
import {DataBaseFileModule} from "../file/data-base.file.module";
import {User} from "../entity/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User]),
    DataBaseFileModule
  ],
  providers: [DataBaseFolderService],
  exports: [DataBaseFolderService]
})
export class DataBaseFolderModule {}