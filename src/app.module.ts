import { Module } from '@nestjs/common';
import { MinioClientModule } from './minio-clinet/minio-client.module';
import {ConfigModule} from "@nestjs/config";
import {DataBaseModule} from "./data-base/data-base.module";
import {AuthModule} from "./authentication/auth.module";
import {UsersModule} from "./data-base/data-base.users.module";

@Module({
  imports: [
    MinioClientModule,
    DataBaseModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
