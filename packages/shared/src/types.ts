export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  role?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}

export interface CategoryDto {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
}

export interface ExpenseDto {
  id: string;
  amount: string;
  description: string | null;
  date: string;
  userId: string;
  categoryId: string | null;
  category: CategoryDto | null;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  date?: string;
  categoryId?: string;
}

export interface PaginatedDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListExpensesQueryDto {
  page?: number;
  pageSize?: number;
}
