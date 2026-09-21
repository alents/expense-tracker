import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransactionCommand } from "../create-transaction.command";
import { TransactionsService } from "../../transactions.service";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: CreateTransactionCommand) {
    return this.transactionsService.create({
      amount: command.amount,
      type: command.type,
      description: command.description,
      date: command.date,
      categoryId: command.categoryId,
      userId: command.userId,
    });
  }
}
