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
  @HttpCode(201)
  @Post('create')
  createFolder(
    @Query('userName') userName: string,
    @Query('parentFolderId') parentFolderId: string,
    @Body() folder: FolderDto
  ): Promise<Folder> {
    return this.folderService.createFolder(folder.folderName, parentFolderId, userName)
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getFolder(
    @Param('id') folderId: string,
    @Query('userName') userName: string
    ) {
    return this.folderService.getFolder(folderId, userName)
  }

  @ApiTags('API')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFolder (
    @Param('id') folderId: string,
    @Query('userName') userName: string
  ) {
    return this.folderService.deleteFolder(folderId, userName)
  }

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get('path/:id')
  pathToParentFolder(@Param('id') folderId: string) {
    return this.folderService.pathToParentFolder(folderId)
  }

}