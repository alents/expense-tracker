import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ExpensesService } from "./expenses.service";
import { ExpensesController } from "./expenses.controller";
import { GetExpensesByUserHandler } from "./queries/handlers/get-expenses-by-user.handler";

@Module({
  imports: [CqrsModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, GetExpensesByUserHandler],
})
export class ExpensesModule {}
