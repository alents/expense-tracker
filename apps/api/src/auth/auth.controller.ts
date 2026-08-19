import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthResponseDto } from "@expense-tracker/shared";
import { AuthService } from "./auth.service";
import { RegisterDtoClass } from "./dto/register.dto";
import { LoginDtoClass } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDtoClass): Promise<AuthResponseDto> {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDtoClass): Promise<AuthResponseDto> {
    return this.authService.login(dto.email, dto.password);
  }
}
