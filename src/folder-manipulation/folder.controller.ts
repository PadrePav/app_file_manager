import {Body, Controller, Delete, Get, HttpCode, Param, Post} from "@nestjs/common";
import {FolderService} from "./folder.service";
import {ApiTags} from "@nestjs/swagger";
import FolderDto from "./dto/folder.dto";

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @ApiTags('API')
  @Post(':id')
  async createFolder(@Param('id') id: string, @Body() folder: FolderDto) {
    return await this.folderService.createFolder(folder.folderName, id)
  }

  @ApiTags('API')
  @Get(':id')
  async openFolder(@Param('id') id: string) {
    return await this.folderService.openFolder(id)
  }

  @ApiTags('API')
  @HttpCode(204)
  @Delete(':id')
  async deleteFolder (@Param('id') id: string) {
    return await this.folderService.deleteFolder(id)
  }

}