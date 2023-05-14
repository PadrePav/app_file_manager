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

  async getByName(userName: string):Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        userName
      },
      relations: {
        space: true
      }
    })
    if (user) {
      return user
    }
    throw new HttpException('User with this name does not exist', HttpStatus.NOT_FOUND)
  }

  async create(user: UserDto):Promise<User> {
    const newUser: User = this.userRepository.create(user);
    return await this.userRepository.save(newUser)
  }

  async createOrGetRootFolder(user: User, folderName: string = 'root'):Promise<Folder> {
    if (!user.space) {
      const space: Folder = this.folderRepository.create({name: folderName})
      user.space = space
      await this.userRepository.save(user)
      return space
    }
    return await this.folderRepository.findOne({
      where: {
        folderId: user.space.folderId
      },
      relations: {
        folders: true,
        files: true
      }
    })
  }
}