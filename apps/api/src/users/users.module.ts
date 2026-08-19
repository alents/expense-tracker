import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { CreateUserHandler } from "./commands/handlers/create-user.handler";
import { GetUserByEmailHandler } from "./queries/handlers/get-user-by-email.handler";
import { GetUserByIdHandler } from "./queries/handlers/get-user-by-id.handler";

const handlers = [CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, ...handlers],
  exports: [UsersService],
})
export class UsersModule {}
