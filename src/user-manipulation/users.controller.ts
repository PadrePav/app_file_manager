import {Controller, Get, Param} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Folder} from "../data-base/entity/folder.entity";
import {ApiTags} from "@nestjs/swagger";

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('API')
  @Get(':id')
  async getRootFolder(@Param('id') userName: string):Promise<Folder> {
    return await this.userService.getRootFolder(userName)
  }

}