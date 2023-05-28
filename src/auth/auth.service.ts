import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {DataBaseUsersService} from "../data-base/user/data-base.users.service";
import AuthSignupDto, {AuthSignInDto} from "./dto/authSignupDto";
import * as bcrypt from 'bcrypt'
import {TokenService} from "../token/token.service";
import {User} from "../data-base/entity/user.entity";
import {ReturnAuthDto} from "./dto/return.auth.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: DataBaseUsersService,
              private readonly tokenService: TokenService) {};

  async signup(data: AuthSignupDto): Promise<ReturnAuthDto> {
    if (data.userName.includes(' ')) {
      throw new HttpException('The name cannot contain spaces', HttpStatus.BAD_REQUEST)
    }
    const hashedPassword: string = bcrypt.hashSync(data.password, 10);
    const newUser: User = await this.usersService.createUser({...data, password: hashedPassword});
    const token: string = this.tokenService.generateJwtToken(newUser.userName);
    return {
      userName: newUser.userName,
      token
    }
  }

  async signIn(data: AuthSignInDto): Promise<ReturnAuthDto> {
    try {
      const user: User = await this.usersService.getUserByName(data.userName);
      await this.verifyPassword(data.password, user.password )
      const token: string = this.tokenService.generateJwtToken(user.userName)
      return {
        userName: user.userName,
        token
      }
    } catch (e) {
      throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
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