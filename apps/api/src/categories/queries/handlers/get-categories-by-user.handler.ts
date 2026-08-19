import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCategoriesByUserQuery } from "../get-categories-by-user.query";
import { CategoriesService } from "../../categories.service";

@QueryHandler(GetCategoriesByUserQuery)
export class GetCategoriesByUserHandler implements IQueryHandler<GetCategoriesByUserQuery> {
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(query: GetCategoriesByUserQuery) {
    return this.categoriesService.findAllByUser(query.userId);
  }
}
