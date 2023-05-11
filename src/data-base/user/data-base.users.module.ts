import {Global, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../entity/user.entity";
import {UsersService} from "./data-base.users.service";
import {Folder} from "../entity/folder.entity";

@Global() //проверить потом работает ли ауз без глобального декоратора, нужно ли его импортировать
@Module({
  imports: [TypeOrmModule.forFeature([User, Folder])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}