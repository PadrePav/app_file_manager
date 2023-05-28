import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards} from "@nestjs/common";
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
    @Body() folderDto: FolderDto
  ): Promise<Folder> {
    return this.folderService.createFolder(folderDto.folderName, parentFolderId, userName)
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
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  changeName(
    @Param('id') folderId: string,
    @Query('userName') userName: string,
    @Body() folderDto: FolderDto
) {
    return this.folderService.changeFolderName(folderDto.folderName, folderId, userName)
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