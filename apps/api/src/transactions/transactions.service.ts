import { Injectable, NotFoundException } from "@nestjs/common";
import { Category, Transaction } from "@prisma/client";
import { TransactionDto, TransactionType } from "@expense-tracker/shared";
import { PrismaService } from "../prisma/prisma.service";

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType;
  categoryId?: string;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    amount: number;
    type: TransactionType;
    description?: string;
    date?: string;
    categoryId?: string;
    userId: string;
  }): Promise<TransactionDto> {
    if (data.categoryId) await this.assertCategoryOwnership(data.categoryId, data.userId);

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        categoryId: data.categoryId,
        userId: data.userId,
      },
      include: { category: true },
    });
    return this.toDto(transaction);
  }

  async findAllByUser(userId: string, filters: TransactionFilters): Promise<TransactionDto[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: filters.type,
        categoryId: filters.categoryId,
        date: {
          gte: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
          lte: filters.dateTo ? new Date(filters.dateTo) : undefined,
        },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });
    return transactions.map((t) => this.toDto(t));
  }

  async findById(id: string, userId: string): Promise<TransactionDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");
    return this.toDto(transaction);
  }

  async update(
    id: string,
    userId: string,
    data: {
      amount?: number;
      type?: TransactionType;
      description?: string;
      date?: string;
      categoryId?: string;
    },
  ): Promise<TransactionDto> {
    await this.findById(id, userId);
    if (data.categoryId) await this.assertCategoryOwnership(data.categoryId, userId);

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    return this.toDto(transaction);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.transaction.delete({ where: { id } });
  }

  private async assertCategoryOwnership(categoryId: string, userId: string): Promise<void> {
    const category = await this.prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException("Category not found");
  }

  private toDto(transaction: Transaction & { category: Category | null }): TransactionDto {
    return {
      id: transaction.id,
      amount: transaction.amount.toString(),
      type: transaction.type as TransactionType,
      description: transaction.description,
      date: transaction.date.toISOString(),
      userId: transaction.userId,
      categoryId: transaction.categoryId,
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
            icon: transaction.category.icon,
            color: transaction.category.color,
            userId: transaction.category.userId,
          }
        : null,
    };
  }
}
