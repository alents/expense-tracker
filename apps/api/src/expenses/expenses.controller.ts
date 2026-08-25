import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ExpenseDto, PaginatedDto, UserDto } from "@expense-tracker/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GetExpensesByUserQuery } from "./queries/get-expenses-by-user.query";

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
      new GetExpensesByUserQuery(user.id, Number(page) || 1, Number(pageSize) || 10),
    );
  }
}
