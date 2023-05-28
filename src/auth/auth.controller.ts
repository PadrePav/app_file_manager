import {AuthService} from "./auth.service";
import {Body, Controller, HttpCode, Post} from "@nestjs/common";
import AuthSignupDto, {AuthSignInDto} from "./dto/authSignupDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReturnAuthDto} from "./dto/return.auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({status: 201, type: ReturnAuthDto})
  @Post('sign-up')
  signup(@Body() dto: AuthSignupDto): Promise<ReturnAuthDto> {
    return this.authService.signup(dto)
  }

  @ApiTags('API')
  @ApiResponse({status: 200, type: ReturnAuthDto})
  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() dto: AuthSignInDto): Promise<ReturnAuthDto> {
    return this.authService.signIn(dto)
  }
}