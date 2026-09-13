"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/widgets/nav-bar/ui/NavBar";
import { TransactionList } from "@/widgets/transaction-list/ui/TransactionList";
import { useRequireAuth } from "@/features/auth/model/guards";

function DashboardContent() {
  const token = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get("page")) || 1;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-muted/40">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Транзакции</h1>
        <TransactionList page={page} onPageChange={(p) => router.push(`/?page=${p}`)} />
      </main>
    </div>
  );
}

export function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
