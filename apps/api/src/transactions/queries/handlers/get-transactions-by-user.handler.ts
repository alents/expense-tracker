import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionsByUserQuery } from "../get-transactions-by-user.query";
import { TransactionsService } from "../../transactions.service";

@QueryHandler(GetTransactionsByUserQuery)
export class GetTransactionsByUserHandler implements IQueryHandler<GetTransactionsByUserQuery> {
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(query: GetTransactionsByUserQuery) {
    return this.transactionsService.findAllByUser(query.userId, {
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      type: query.type,
      categoryId: query.categoryId,
    });
  }
}
