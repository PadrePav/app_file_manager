import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Folder} from "../entity/folder.entity";
import {DataBaseFolderService} from "./data-base.folder.service";
import {DataBaseFileModule} from "../file/data-base.file.module";
import {User} from "../entity/user.entity";
import {DataBaseUsersModule} from "../user/data-base.users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User]),
    DataBaseFileModule,
    DataBaseUsersModule
  ],
  providers: [DataBaseFolderService],
  exports: [DataBaseFolderService]
})
export class DataBaseFolderModule {}