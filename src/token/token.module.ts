import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}m`,
        },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
