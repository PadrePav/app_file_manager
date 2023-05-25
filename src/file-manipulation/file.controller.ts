import {
  Controller,
  Delete,
  Get, HttpCode,
  Param,
  Post, Query, Res, StreamableFile,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {FileService} from "./file.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express, Response} from "express";
import {FileStreamDto} from "../data-base/dto/file.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {File} from "../data-base/entity/file.entity";
import {JwtAuthGuard} from "../guards/jwt.guard";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  //добавить на фронт запрос через боди
  @ApiTags('API')
  @ApiResponse({status: 201, type: File})
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File,
                   @Query('userName') userName,
                   @Query('parentFolderId') parentFolderId
  ) {
   return this.fileService.uploadFile(file, userName, parentFolderId)
  }


  //добавить на фронт запрос через боди
  //и убрать без айдишника
  @ApiTags('API')
  // @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async downloadFile(
    @Param('id') fileId: string,
    @Query('userName') userName,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const file: FileStreamDto = await this.fileService.downloadFile(fileId, userName)
    res.attachment(file.filename)
    // @ts-ignore
    return new StreamableFile(file.stream);
  }

  //добавить на фронт запрос через боди
  @ApiTags('API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFile(
    @Param('id') fileId: string,
    @Query('userName') userName: string) {
    return this.fileService.deleteFile(fileId, userName)
  }
}