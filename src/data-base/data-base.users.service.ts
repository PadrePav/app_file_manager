import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {Repository} from "typeorm";
import UserDto from "./dto/user.dto";
import {Folder} from "./entity/folder.entity";


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(Folder) private readonly folderRepository: Repository<Folder>) {}

  async getByName(userName: string) {
    const user = await this.userRepository.findOne({
      where: {
        userName
      },
      relations: {
        space: true
      }
    })
    if (user) {
      console.log(user)
      return user
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
  }

  async create(user: UserDto) {
    const newSpace = await this.folderRepository.create({ name: 'root' })
    const newUser = await this.userRepository.create({ ...user, space: newSpace })
    return await this.userRepository.save(newUser)
  }

}