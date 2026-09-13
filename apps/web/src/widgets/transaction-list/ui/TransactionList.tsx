"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Pagination } from "@/shared/ui/pagination";
import { useExpenses } from "@/features/expenses/model/useExpenses";

export interface TransactionListProps {
  page: number;
  onPageChange: (page: number) => void;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
const amountFormatter = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" });

export function TransactionList({ page, onPageChange }: TransactionListProps) {
  const { data, isLoading, error } = useExpenses(page);

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Загрузка…</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">Не удалось загрузить транзакции: {error}</CardContent>
      </Card>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Нет транзакций</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Описание</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 text-right font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((expense) => (
                <tr key={expense.id} className="border-b last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">{dateFormatter.format(new Date(expense.date))}</td>
                  <td className="px-4 py-3">{expense.description ?? "—"}</td>
                  <td className="px-4 py-3">{expense.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {amountFormatter.format(Number(expense.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={onPageChange} />
    </div>
  );
}
