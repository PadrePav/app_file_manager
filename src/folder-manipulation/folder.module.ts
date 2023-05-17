import {Module} from "@nestjs/common";
import {DataBaseFolderModule} from "../data-base/folder/data-base.folder.module";
import {FolderService} from "./folder.service";
import {FolderController} from "./folder.controller";

@Module({
  imports: [DataBaseFolderModule],
  controllers: [FolderController],
  providers: [FolderService]
})
export class FolderModule {}