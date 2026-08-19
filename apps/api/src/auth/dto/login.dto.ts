import { IsEmail, IsString, MinLength } from "class-validator";
import { LoginDto } from "@expense-tracker/shared";

export class LoginDtoClass implements LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
