import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TransactionDto, TransactionType, UserDto } from "@expense-tracker/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CreateTransactionCommand } from "./commands/create-transaction.command";
import { UpdateTransactionCommand } from "./commands/update-transaction.command";
import { DeleteTransactionCommand } from "./commands/delete-transaction.command";
import { GetTransactionsByUserQuery } from "./queries/get-transactions-by-user.query";
import { GetTransactionByIdQuery } from "./queries/get-transaction-by-id.query";

@UseGuards(JwtAuthGuard)
@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: UserDto, @Body() dto: CreateTransactionDto): Promise<TransactionDto> {
    return this.commandBus.execute(
      new CreateTransactionCommand(user.id, dto.amount, dto.type, dto.description, dto.date, dto.categoryId),
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: UserDto,
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string,
    @Query("type") type?: TransactionType,
    @Query("categoryId") categoryId?: string,
  ): Promise<TransactionDto[]> {
    return this.queryBus.execute(new GetTransactionsByUserQuery(user.id, dateFrom, dateTo, type, categoryId));
  }

  @Get(":id")
  findOne(@CurrentUser() user: UserDto, @Param("id") id: string): Promise<TransactionDto> {
    return this.queryBus.execute(new GetTransactionByIdQuery(id, user.id));
  }

  @Patch(":id")
  update(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return this.commandBus.execute(
      new UpdateTransactionCommand(id, user.id, dto.amount, dto.type, dto.description, dto.date, dto.categoryId),
    );
  }

  @Delete(":id")
  delete(@CurrentUser() user: UserDto, @Param("id") id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
