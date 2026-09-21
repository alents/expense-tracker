import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTransactionCommand } from "../update-transaction.command";
import { TransactionsService } from "../../transactions.service";

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: UpdateTransactionCommand) {
    return this.transactionsService.update(command.id, command.userId, {
      amount: command.amount,
      type: command.type,
      description: command.description,
      date: command.date,
      categoryId: command.categoryId,
    });
  }
}
