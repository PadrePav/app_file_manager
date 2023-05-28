import {Module} from "@nestjs/common";
import {FileController} from "./file.controller";
import {FileService} from "./file.service";
import {DataBaseFileModule} from "../data-base/file/data-base.file.module";

@Module({
  imports: [
    DataBaseFileModule,
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}