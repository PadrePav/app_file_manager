import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000']
    }
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const configService = app.get(ConfigService)
  const port = configService.get('SERVER_PORT')

  const config = new DocumentBuilder()
    .setTitle('File manager')
    .setDescription('This description is for working with the server part')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  await app.listen(port);
}
bootstrap();
