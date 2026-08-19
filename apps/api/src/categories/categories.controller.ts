import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CategoryDto, UserDto } from "@expense-tracker/shared";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";
import { GetCategoriesByUserQuery } from "./queries/get-categories-by-user.query";

@UseGuards(JwtAuthGuard)
@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: UserDto, @Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.commandBus.execute(new CreateCategoryCommand(dto.name, dto.icon, dto.color, user.id));
  }

  @Get()
  findAll(@CurrentUser() user: UserDto): Promise<CategoryDto[]> {
    return this.queryBus.execute(new GetCategoriesByUserQuery(user.id));
  }

  @Patch(":id")
  update(
    @CurrentUser() user: UserDto,
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.commandBus.execute(new UpdateCategoryCommand(id, user.id, dto.name, dto.icon, dto.color));
  }

  @Delete(":id")
  delete(@CurrentUser() user: UserDto, @Param("id") id: string): Promise<void> {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
