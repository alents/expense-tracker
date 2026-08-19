import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../get-user-by-id.query";
import { UsersService } from "../../users.service";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly usersService: UsersService) {}

  execute(query: GetUserByIdQuery) {
    return this.usersService.findById(query.id);
  }
}
