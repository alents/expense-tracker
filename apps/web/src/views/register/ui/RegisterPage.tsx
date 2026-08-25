import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Уже есть аккаунт?&nbsp;
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
