import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDto } from "@expense-tracker/shared";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
