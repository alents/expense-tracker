import { apiFetch } from "@/shared/api/client";
import type { ExpenseDto, PaginatedDto } from "@expense-tracker/shared";

export function getExpenses(page: number, pageSize = 10): Promise<PaginatedDto<ExpenseDto>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return apiFetch<PaginatedDto<ExpenseDto>>(`/api/expenses?${params.toString()}`);
}
