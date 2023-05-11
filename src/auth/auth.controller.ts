import {AuthService} from "./auth.service";
import {Body, Controller, Post} from "@nestjs/common";
import AuthDto from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto)
  }
}