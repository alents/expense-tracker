import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "../create-category.command";
import { CategoriesService } from "../../categories.service";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(command: CreateCategoryCommand) {
    return this.categoriesService.create({
      name: command.name,
      icon: command.icon,
      color: command.color,
      userId: command.userId,
    });
  }
}
