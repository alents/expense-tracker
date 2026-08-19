import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCategoryByIdQuery } from "../get-category-by-id.query";
import { CategoriesService } from "../../categories.service";

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(private readonly categoriesService: CategoriesService) {}

  execute(query: GetCategoryByIdQuery) {
    return this.categoriesService.findById(query.id, query.userId);
  }
}
