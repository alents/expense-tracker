import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { CreateTransactionDto as ICreateTransactionDto, TransactionType } from "@expense-tracker/shared";

export class CreateTransactionDto implements ICreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(["INCOME", "EXPENSE"])
  type!: TransactionType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;
}
