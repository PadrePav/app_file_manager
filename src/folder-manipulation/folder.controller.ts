import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {FolderService} from "./folder.service";

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post(':id')
  async createFolder(@Param('id') id: string, @Body() folder: {folderName: string}) {
    return await this.folderService.createFolder(folder.folderName, id)
  }

  @Get(':id')
  async openFolder(@Param('id') id: string) {
    return await this.folderService.openFolder(id)
  }

  @Delete(':id')
  async deleteFolder (@Param('id') id: string) {
    return await this.folderService.deleteFolder(id)
  }

}