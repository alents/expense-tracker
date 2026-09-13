"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth/model/authStore";

const NAV_LINKS = [
  { href: "/", label: "Транзакции" },
  { href: "/categories", label: "Категории" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-6">
          <span className="font-semibold">Expense Tracker</span>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "font-medium text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name ?? user?.email ?? null} />
          <span className="text-sm text-muted-foreground">{user?.name ?? user?.email}</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
