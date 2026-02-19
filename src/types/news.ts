// types/news.ts
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  date: string;
}

export interface NewsListResponse {
  success: boolean;
  message: string;
  data: NewsItem[];
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsItem;
}

export interface NewsActionResponse {
  success: boolean;
  message: string;
}

export interface CreateNewsDto {
  title: string;
  description: string;
  imgUrl: string;
  date?: string;
}

export interface UpdateNewsDto {
  id: number;
  title?: string;
  description?: string;
  imgUrl?: string;
  date?: string;
}

export interface NewsListParams {
  page?: number;
  size?: number;
  search?: string;
  [key: string]: string | number | boolean | null | undefined; // IGNORE - vaqtincha error yo'qotish uchun
}