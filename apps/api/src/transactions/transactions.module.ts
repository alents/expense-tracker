import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { CreateTransactionHandler } from "./commands/handlers/create-transaction.handler";
import { UpdateTransactionHandler } from "./commands/handlers/update-transaction.handler";
import { DeleteTransactionHandler } from "./commands/handlers/delete-transaction.handler";
import { GetTransactionsByUserHandler } from "./queries/handlers/get-transactions-by-user.handler";
import { GetTransactionByIdHandler } from "./queries/handlers/get-transaction-by-id.handler";

const handlers = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
  DeleteTransactionHandler,
  GetTransactionsByUserHandler,
  GetTransactionByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, ...handlers],
})
export class TransactionsModule {}
