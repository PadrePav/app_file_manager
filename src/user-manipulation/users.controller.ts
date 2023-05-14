import {Controller, Get, Param} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Folder} from "../data-base/entity/folder.entity";

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getRootFolder(@Param('id') userName: string):Promise<Folder> {
    return await this.userService.getRootFolder(userName)
  }

}