import { IsNotEmpty, IsString, Matches } from "class-validator";
import { CreateCategoryDto as ICreateCategoryDto } from "@expense-tracker/shared";

export class CreateCategoryDto implements ICreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  icon!: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: "color must be a valid hex color (e.g. #FF5733)" })
  color!: string;
}
