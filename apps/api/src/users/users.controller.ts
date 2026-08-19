import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { UserDto } from "@expense-tracker/shared";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async updateMe(
    @CurrentUser() user: UserDto,
    @Body() body: { name?: string },
  ): Promise<UserDto | null> {
    return this.usersService.update(user.id, body);
  }
}
