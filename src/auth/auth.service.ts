import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UsersService} from "../data-base/user/data-base.users.service";
import AuthDto from "./dto/auth.dto";
import * as bcrypt from 'bcrypt'
import PostgresErrorCode from "./error-handler-ps/postgress.error";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwt: JwtService) {};

  async signup(data: AuthDto): Promise<string> {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    try {
      const newUser = await this.usersService.create({...data, password: hashedPassword});
      return this.signToken(newUser.userId)
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(data: AuthDto): Promise<string> {
    try {
      const user = await this.usersService.getByName(data.userName);
      await this.verifyPassword(data.password, user.password )
      return this.signToken(user.userId)
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

  signToken(userId: number) {
    const payload = {
      sub: userId
    }
    return this.jwt.sign(payload)
  }
}