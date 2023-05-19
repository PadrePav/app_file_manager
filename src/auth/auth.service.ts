import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {DataBaseUsersService} from "../data-base/user/data-base.users.service";
import AuthDto from "./dto/auth.dto";
import * as bcrypt from 'bcrypt'
import PostgresErrorCode from "./error-handler-ps/postgress.error";
import {TokenService} from "../token/token.service";
import {User} from "../data-base/entity/user.entity";
import {ReturnAuthDto} from "./dto/return.auth.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: DataBaseUsersService,
              private readonly tokenService: TokenService) {};

  async signup(data: AuthDto): Promise<ReturnAuthDto> {
    try {
      const hashedPassword: string = bcrypt.hashSync(data.password, 10); //Добавить в дотенв соль
      const newUser: User = await this.usersService.create({...data, password: hashedPassword});
      const token: string = this.tokenService.generateJwtToken(newUser.userName)
      return {
        userName: newUser.userName,
        token
      }
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(data: AuthDto): Promise<ReturnAuthDto> {
    try {
      const user: User = await this.usersService.getByName(data.userName);
      await this.verifyPassword(data.password, user.password )
      const token: string = this.tokenService.generateJwtToken(user.userName)
      return {
        userName: user.userName,
        token
      }
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
}