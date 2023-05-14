import { Module } from '@nestjs/common';
import { MinioClientModule } from './minio-clinet/minio-client.module';
import {ConfigModule} from "@nestjs/config";
import {DataBaseModule} from "./data-base/data-base.module";
import {AuthModule} from "./auth/auth.module";
import {DataBaseUsersModule} from "./data-base/user/data-base.users.module";
import {FileModule} from "./file-manipulation/file.module";
import {FolderModule} from "./folder-manipulation/folder.module";
import {UsersModule} from "./user-manipulation/users.module";
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    MinioClientModule,
    DataBaseModule,
    AuthModule,
    DataBaseUsersModule,
    FileModule,
    FolderModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
