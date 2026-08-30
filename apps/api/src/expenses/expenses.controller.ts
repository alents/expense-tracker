import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ExpenseDto, PaginatedDto, UserDto } from "@expense-tracker/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GetExpensesByUserQuery } from "./queries/get-expenses-by-user.query";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

@UseGuards(JwtAuthGuard)
@Controller("expenses")
export class ExpensesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  findAll(
    @CurrentUser() user: UserDto,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ): Promise<PaginatedDto<ExpenseDto>> {
    return this.queryBus.execute(
      new GetExpensesByUserQuery(user.id, parsePositiveInt(page, 1), parsePositiveInt(pageSize, 10)),
    );
  }
}
