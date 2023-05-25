import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";
import {FolderService} from "./folder.service";
import {ApiTags} from "@nestjs/swagger";
import FolderDto from "./dto/folder.dto";
import {Folder} from "../data-base/entity/folder.entity";
import {JwtAuthGuard} from "../guards/jwt.guard";

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createFolder(
    @Query('userName') userName: string,
    @Query('parentFolderId') parentFolderId: string,
    @Body() folder: FolderDto
  ): Promise<Folder> {
    return await this.folderService.createFolder(folder.folderName, parentFolderId, userName)
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getFolder(
    @Param('id') folderId: string,
    @Query('userName') userName: string
    ) {
    return await this.folderService.getFolder(folderId, userName)
  }

  @ApiTags('API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteFolder (
    @Param('id') folderId: string,
    @Query('userName') userName: string
  ): Promise<HttpStatus.NO_CONTENT> {
    return await this.folderService.deleteFolder(folderId, userName)
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get('path/:id')
  pathToParentFolder(@Param('id') folderId: string) {
    return this.folderService.pathToParentFolder(folderId)
  }

}