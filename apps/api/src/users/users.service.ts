import { Injectable } from "@nestjs/common";
import { UserDto } from "@expense-tracker/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDto(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; passwordHash: string; name?: string }): Promise<UserDto> {
    const user = await this.prisma.user.create({ data });
    return this.toDto(user);
  }

  async update(id: string, data: { name?: string }): Promise<UserDto | null> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return this.toDto(user);
  }

  private toDto(user: { id: string; email: string; name: string | null; role: string }): UserDto {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
