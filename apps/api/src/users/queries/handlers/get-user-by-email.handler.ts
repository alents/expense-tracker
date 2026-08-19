import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "../get-user-by-email.query";
import { UsersService } from "../../users.service";

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly usersService: UsersService) {}

  execute(query: GetUserByEmailQuery) {
    return this.usersService.findByEmail(query.email);
  }
}
