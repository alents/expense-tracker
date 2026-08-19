import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CategoryDto } from "@expense-tracker/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; icon: string; color: string; userId: string }): Promise<CategoryDto> {
    const existing = await this.prisma.category.findUnique({
      where: { userId_name: { userId: data.userId, name: data.name } },
    });
    if (existing) throw new ConflictException(`Category "${data.name}" already exists`);

    const category = await this.prisma.category.create({ data });
    return this.toDto(category);
  }

  async findAllByUser(userId: string): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({ where: { userId } });
    return categories.map((c) => this.toDto(c));
  }

  async findById(id: string, userId: string): Promise<CategoryDto> {
    const category = await this.prisma.category.findFirst({ where: { id, userId } });
    if (!category) throw new NotFoundException(`Category not found`);
    return this.toDto(category);
  }

  async update(
    id: string,
    userId: string,
    data: { name?: string; icon?: string; color?: string },
  ): Promise<CategoryDto> {
    await this.findById(id, userId);

    if (data.name) {
      const conflict = await this.prisma.category.findUnique({
        where: { userId_name: { userId, name: data.name } },
      });
      if (conflict && conflict.id !== id) throw new ConflictException(`Category "${data.name}" already exists`);
    }

    const category = await this.prisma.category.update({ where: { id }, data });
    return this.toDto(category);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    await this.prisma.category.delete({ where: { id } });
  }

  private toDto(category: { id: string; name: string; icon: string; color: string; userId: string }): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      userId: category.userId,
    };
  }
}
