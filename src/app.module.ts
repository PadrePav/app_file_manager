import { Module } from '@nestjs/common';
import { MinioClientModule } from './minio-clinet/minio-client.module';
import {ConfigModule} from "@nestjs/config";
import {DataBaseModule} from "./data-base/data-base.module";

@Module({
  imports: [
    MinioClientModule,
    DataBaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
