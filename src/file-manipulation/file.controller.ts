import {Controller, Delete, Param, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileService} from "./file.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from "express";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return await this.fileService.uploadFile(file, id)
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.fileService.deleteFile(id)
  }
}