import {Injectable} from "@nestjs/common";
import {DataBaseUsersService} from "../data-base/user/data-base.users.service";
import {User} from "../data-base/entity/user.entity";
import {Folder} from "../data-base/entity/folder.entity";

@Injectable()
export class UsersService {
  constructor(private readonly dbUserService: DataBaseUsersService) {}

  async getRootFolder(userName: string):Promise<Folder> {
    const user: User = await this.dbUserService.getByName(userName)
    return await this.dbUserService.createOrGetRootFolder(user)
  }
}