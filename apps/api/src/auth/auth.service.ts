import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import * as bcrypt from "bcrypt";
import { AuthResponseDto, UserDto } from "@expense-tracker/shared";
import { CreateUserCommand, GetUserByEmailQuery } from "../users";

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string): Promise<AuthResponseDto> {
    const existing = await this.queryBus.execute(new GetUserByEmailQuery(email));
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: UserDto = await this.commandBus.execute(
      new CreateUserCommand(email, passwordHash, name),
    );

    return { accessToken: this.signToken(user), user };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.queryBus.execute(new GetUserByEmailQuery(email));
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const userDto: UserDto = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { accessToken: this.signToken(userDto), user: userDto };
  }

  private signToken(user: UserDto): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
