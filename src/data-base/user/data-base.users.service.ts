import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entity/user.entity";
import {Repository} from "typeorm";
import UserDto from "../dto/user.dto";
import {Folder} from "../entity/folder.entity";


@Injectable()
export class DataBaseUsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>) {}

  async getUserByName(userName: string, relation: boolean = false):Promise<User> {
    let user: User
    if (relation) {
      user = await this.userRepository.findOne({
        select: {

        },
        where: {
          userName
        }, relations: {
          rootFolder: {
            folders: {
              folders: false,
              files: false
            },
            files: true,
            owner: true
          }
        }
      })
    } else {
      user = await this.userRepository.findOne({
        where: {
          userName
        }
      })
    }
    if (!user) {
      throw new HttpException('User with this name does not exist', HttpStatus.NOT_FOUND)
    }
    return user
  }

  async createUser(user: UserDto):Promise<User> {
    const newUser: User = this.userRepository.create(user);
    return await this.userRepository.save(newUser)
  }

  async getOrCreateRootFolder(user: User, folderName: string = 'Root'):Promise<Folder> {

    if (!user.rootFolder) {
      console.log(user, 'false')
      const rootFolder: Folder = this.folderRepository.create({name: folderName, path: '/user/root', owner: user})
      user.rootFolder = rootFolder
      await this.userRepository.save(user)
      delete rootFolder.owner
      return rootFolder
    }
    console.log(user.rootFolder, 'no root')
    delete user.rootFolder.owner
    return user.rootFolder
  }
}