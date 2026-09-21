import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionByIdQuery } from "../get-transaction-by-id.query";
import { TransactionsService } from "../../transactions.service";

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler implements IQueryHandler<GetTransactionByIdQuery> {
  constructor(private readonly transactionsService: TransactionsService) {}

  execute(query: GetTransactionByIdQuery) {
    return this.transactionsService.findById(query.id, query.userId);
  }
}
