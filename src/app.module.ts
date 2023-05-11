import { Module } from '@nestjs/common';
import { MinioClientModule } from './minio-clinet/minio-client.module';
import {ConfigModule} from "@nestjs/config";
import {DataBaseModule} from "./data-base/data-base.module";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./data-base/user/data-base.users.module";
import {FileModule} from "./file-manipulation/file.module";

@Module({
  imports: [
    MinioClientModule,
    DataBaseModule,
    AuthModule,
    UsersModule,
    FileModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
