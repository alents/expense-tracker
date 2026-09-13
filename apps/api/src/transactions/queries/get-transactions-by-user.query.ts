import { TransactionType } from "@expense-tracker/shared";

export class GetTransactionsByUserQuery {
  constructor(
    public readonly userId: string,
    public readonly dateFrom?: string,
    public readonly dateTo?: string,
    public readonly type?: TransactionType,
    public readonly categoryId?: string,
  ) {}
}
