import {
  Controller,
  Delete,
  Get, HttpCode,
  Param,
  Post, Res, StreamableFile,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import {FileService} from "./file.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express, Response} from "express";
import {FileStreamDto} from "../data-base/dto/file.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {File} from "../data-base/entity/file.entity";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiTags('API')
  @ApiResponse({status: 201, type: File})
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string):Promise<File> {
    return await this.fileService.uploadFile(file, id)
  }

  @ApiTags('API')
  @Get(':id')
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file: FileStreamDto = await this.fileService.downloadFile(id)
    res.attachment(file.filename)
    // @ts-ignore
    return new StreamableFile(file.stream);
  }

  @ApiTags('API')
  @HttpCode(204)
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.fileService.deleteFile(id)
  }
}