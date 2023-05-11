import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UsersService} from "../data-base/data-base.users.service";
import AuthDto from "./dto/auth.dto";
import * as bcrypt from 'bcrypt'
import PostgresErrorCode from "./error-handler-ps/postgress.error";
import {User} from "../data-base/entity/user.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwt: JwtService) {};

  async signup(data: AuthDto): Promise<User> {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    console.log(hashedPassword)
    try {
      const newUser = await this.usersService.create({...data, password: hashedPassword});
      delete newUser.password
      return newUser;
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(data: AuthDto): Promise<User> {
    try {
      const user = await this.usersService.getByName(data.userName);
      await this.verifyPassword(data.password, user.password )
      delete user.password
      return user
    } catch (e) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  signToken(userId: number, userName: string) {
    const payload = {
      sub: userId,
      userName
    }
    return this.jwt.sign(payload)
  }
}