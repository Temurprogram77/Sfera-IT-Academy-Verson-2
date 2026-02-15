// types/category.ts

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  duration: number;
  questionLimit: number;
  imgUrl: string;
}

export interface CategoryListParams extends Record<string, string | number | undefined> {
  name?: string;
  page?: number;
  size?: number;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryActionResponse {
  success: boolean;
  message: string;
  data: Category | null;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  duration: number;
  questionLimit: number;
  imgUrl: string;
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
  description: string;
  duration: number;
  questionLimit: number;
  imgUrl: string;
}