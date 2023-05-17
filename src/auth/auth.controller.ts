import {AuthService} from "./auth.service";
import {Body, Controller, HttpCode, HttpException, HttpStatus, Post} from "@nestjs/common";
import AuthDto from "./dto/auth.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReturnAuthDto} from "./dto/return.auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({status: 201, type: ReturnAuthDto})
  @Post('sign-up')
  signup(@Body() dto: AuthDto) {
    if (dto.userName.includes(' ')) {
      throw new HttpException('The name cannot contain spaces', HttpStatus.BAD_REQUEST)
    }
    return this.authService.signup(dto)
  }

  @ApiTags('API')
  @ApiResponse({status: 200, type: ReturnAuthDto})
  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto)
  }
}