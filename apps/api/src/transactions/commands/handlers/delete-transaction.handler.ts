import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTransactionCommand } from "../delete-transaction.command";
import { TransactionsService } from "../../transactions.service";

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(command: DeleteTransactionCommand) {
    return this.transactionsService.delete(command.id, command.userId);
  }
}
