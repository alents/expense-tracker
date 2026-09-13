"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { NavBar } from "@/widgets/nav-bar/ui/NavBar";
import { useRequireAuth } from "@/features/auth/model/guards";

export function CategoriesPage() {
  const token = useRequireAuth();

  if (!token) return null;

  return (
    <div className="min-h-screen bg-muted/40">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold">Категории</h1>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Раздел в разработке</CardContent>
        </Card>
      </main>
    </div>
  );
}
