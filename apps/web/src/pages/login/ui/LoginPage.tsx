import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Вход</CardTitle>
          <CardDescription>Введите данные для входа в аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Нет аккаунта?&nbsp;
          <Link href="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
