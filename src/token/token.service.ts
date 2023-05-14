import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {
  }

  generateJwtToken(userName: string): string {
    const payload = {
      sub: userName
    }
    return this.jwt.sign(payload)
  }
}
