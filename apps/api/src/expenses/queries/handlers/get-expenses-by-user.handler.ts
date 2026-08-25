import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetExpensesByUserQuery } from "../get-expenses-by-user.query";
import { ExpensesService } from "../../expenses.service";

@QueryHandler(GetExpensesByUserQuery)
export class GetExpensesByUserHandler implements IQueryHandler<GetExpensesByUserQuery> {
  constructor(private readonly expensesService: ExpensesService) {}

  execute(query: GetExpensesByUserQuery) {
    return this.expensesService.findAllByUser(query.userId, query.page, query.pageSize);
  }
}
