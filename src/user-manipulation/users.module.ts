import {Module} from "@nestjs/common";
import {DataBaseUsersModule} from "../data-base/user/data-base.users.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";

@Module({
  imports: [DataBaseUsersModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}