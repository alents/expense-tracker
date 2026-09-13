import { TransactionType } from "@expense-tracker/shared";

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount?: number,
    public readonly type?: TransactionType,
    public readonly description?: string,
    public readonly date?: string,
    public readonly categoryId?: string,
  ) {}
}
