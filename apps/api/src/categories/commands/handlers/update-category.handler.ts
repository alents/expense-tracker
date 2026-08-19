import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateCategoryCommand } from "../update-category.command";
import { CategoriesService } from "../../categories.service";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(command: UpdateCategoryCommand) {
    return this.categoriesService.update(command.id, command.userId, {
      name: command.name,
      icon: command.icon,
      color: command.color,
    });
  }
}
