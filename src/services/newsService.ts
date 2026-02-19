import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  NewsActionResponse,
  NewsListParams,
  NewsListResponse,
  NewsResponse,
  CreateNewsDto,
  UpdateNewsDto,
} from "../types/news";

class NewsService {
  async getNews(params?: NewsListParams): Promise<NewsListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.NEWS.LIST, params);
      const response = await apiClient.get<NewsListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get news error:", error);
      throw error;
    }
  }

  async getNewsById(newsId: string | number): Promise<NewsResponse> {
    try {
      const url = API_ENDPOINTS.NEWS.GET_BY_ID(newsId);
      const response = await apiClient.get<NewsResponse>(url);
      return response;
    } catch (error) {
      console.error("Get news by ID error:", error);
      throw error;
    }
  }

  async createNews(data: CreateNewsDto): Promise<NewsActionResponse> {
    try {
      const response = await apiClient.post<NewsActionResponse>(
        API_ENDPOINTS.NEWS.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create news error:", error);
      throw error;
    }
  }

  async updateNews(data: UpdateNewsDto): Promise<NewsActionResponse> {
    try {
      const response = await apiClient.put<NewsActionResponse>(
        API_ENDPOINTS.NEWS.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update news error:", error);
      throw error;
    }
  }

  async deleteNews(newsId: string | number): Promise<NewsActionResponse> {
    try {
      const url = API_ENDPOINTS.NEWS.DELETE(newsId);
      const response = await apiClient.delete<NewsActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete news error:", error);
      throw error;
    }
  }
}

export const newsService = new NewsService();
