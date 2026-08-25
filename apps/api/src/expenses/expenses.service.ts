import { Injectable } from "@nestjs/common";
import { Category, Expense } from "@prisma/client";
import { ExpenseDto, PaginatedDto } from "@expense-tracker/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string, page: number, pageSize: number): Promise<PaginatedDto<ExpenseDto>> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(100, Math.max(1, pageSize));

    const [expenses, total] = await this.prisma.$transaction([
      this.prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: "desc" },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),
      this.prisma.expense.count({ where: { userId } }),
    ]);

    return {
      items: expenses.map((e) => this.toDto(e)),
      total,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  private toDto(expense: Expense & { category: Category | null }): ExpenseDto {
    return {
      id: expense.id,
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date.toISOString(),
      userId: expense.userId,
      categoryId: expense.categoryId,
      category: expense.category
        ? {
            id: expense.category.id,
            name: expense.category.name,
            icon: expense.category.icon,
            color: expense.category.color,
            userId: expense.category.userId,
          }
        : null,
    };
  }
}
