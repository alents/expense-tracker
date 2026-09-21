import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CategoriesModule } from "./categories/categories.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    TransactionsModule,
  ],
})
export class AppModule {}
