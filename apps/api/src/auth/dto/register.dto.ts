import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { RegisterDto } from "@expense-tracker/shared";

export class RegisterDtoClass implements RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}
