import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user.command";
import { UsersService } from "../../users.service";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  execute(command: CreateUserCommand) {
    return this.usersService.create({
      email: command.email,
      passwordHash: command.passwordHash,
      name: command.name,
    });
  }
}
