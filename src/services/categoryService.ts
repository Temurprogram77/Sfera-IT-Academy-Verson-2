// services/categoryService.ts

import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import {
  CategoryActionResponse,
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

class CategoryService {
  async getCategories(params?: CategoryListParams): Promise<CategoryListResponse> {
    try {
      const url = buildUrlWithParams(API_ENDPOINTS.CATEGORY.LIST, params);
      const response = await apiClient.get<CategoryListResponse>(url);
      return response;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  }

  async getCategoryById(categoryId: string | number): Promise<CategoryResponse> {
    try {
      const url = API_ENDPOINTS.CATEGORY.GET_BY_ID(categoryId);
      const response = await apiClient.get<CategoryResponse>(url);
      return response;
    } catch (error) {
      console.error("Get category by ID error:", error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryActionResponse> {
    try {
      const response = await apiClient.post<CategoryActionResponse>(
        API_ENDPOINTS.CATEGORY.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  }

  async updateCategory(data: UpdateCategoryDto): Promise<CategoryActionResponse> {
    try {
      const response = await apiClient.put<CategoryActionResponse>(
        API_ENDPOINTS.CATEGORY.UPDATE,
        data,
      );
      return response;
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  }

  async deleteCategory(categoryId: string | number): Promise<CategoryActionResponse> {
    try {
      const url = API_ENDPOINTS.CATEGORY.DELETE(categoryId);
      const response = await apiClient.delete<CategoryActionResponse>(url);
      return response;
    } catch (error) {
      console.error("Delete category error:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();