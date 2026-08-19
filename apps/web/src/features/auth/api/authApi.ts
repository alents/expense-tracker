import { apiFetch } from "@/shared/api/client";
import type { AuthResponseDto, LoginDto, RegisterDto } from "@expense-tracker/shared";

export function login(dto: LoginDto): Promise<AuthResponseDto> {
  return apiFetch<AuthResponseDto>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function register(dto: RegisterDto): Promise<AuthResponseDto> {
  return apiFetch<AuthResponseDto>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
