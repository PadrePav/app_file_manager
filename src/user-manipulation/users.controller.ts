import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Folder} from "../data-base/entity/folder.entity";
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../guards/jwt.guard";
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get('root')
  async getOrCreateRootFolder(@Query('userName') userName: string):Promise<Folder> {
    return await this.userService.getOrCreateRootFolder(userName)
  }

}