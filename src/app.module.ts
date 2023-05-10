import { Module } from '@nestjs/common';
import { MinioClientModule } from './minio-clinet/minio-client.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    MinioClientModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
