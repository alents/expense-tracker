"use client";

import { useEffect, useState } from "react";
import type { ExpenseDto, PaginatedDto } from "@expense-tracker/shared";
import { getExpenses } from "../api/expensesApi";

export function useExpenses(page: number) {
  const [data, setData] = useState<PaginatedDto<ExpenseDto> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getExpenses(page)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return { data, isLoading, error };
}
