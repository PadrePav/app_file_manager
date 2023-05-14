import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Folder} from "../data-base/entity/folder.entity";
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../guards/jwt.guard";

@Controller('user/root')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('API')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRootFolder(@Req() req):Promise<Folder> {
    const user = req.user
    return await this.userService.getRootFolder(user.userName)
  }

}