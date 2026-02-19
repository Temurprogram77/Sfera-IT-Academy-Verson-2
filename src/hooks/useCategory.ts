// hooks/useCategory.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryService } from "../services/categoryService";
import {
  CategoryListResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryActionResponse,
  CategoryListParams,
} from "../types/category";
import { QUERY_KEYS } from "../types/queryKeys";

export const useCategories = (params?: CategoryListParams) => {
  const queryClient = useQueryClient();

  // Agar search term bo'lsa SEARCH endpoint ishlatamiz, aks holda LIST
  const hasSearchParams = params?.name && params.name.trim().length > 0;

  const {
    data: categoryData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<CategoryListResponse, Error>({
    queryKey: [
      hasSearchParams ? QUERY_KEYS.CATEGORIES.SEARCH : QUERY_KEYS.CATEGORIES.ALL,
      params
    ],
    queryFn: () =>
      hasSearchParams
        ? categoryService.searchCategories(params)
        : categoryService.getCategories(params),
    staleTime: 1000 * 60 * 5,
  });

  // Debug: API dan kelgan ma'lumotni ko'rish
  console.log("Category API Response:", categoryData);

  // API dan kelgan ma'lumotni flexible parse qilish
  const getCategoriesData = () => {
    if (!categoryData?.data) return [];

    // Agar data.body bo'lsa (pagination format)
    if (categoryData.data && Array.isArray(categoryData.data)) {
      return categoryData.data;
    }

    // Agar data to'g'ridan-to'g'ri array bo'lsa
    if (Array.isArray(categoryData.data)) {
      return categoryData.data;
    }

    return [];
  };

  const getPaginationData = () => {
    if (!categoryData?.data) {
      return { page: 0, size: 10, totalPage: 0, totalElements: 0 };
    }

    // Agar pagination object bo'lsa
    if (typeof categoryData.data === 'object' && 'body' in categoryData.data) {
      return {
        page: categoryData.data.page || 0,
        size: categoryData.data.size || 10,
        totalPage: categoryData.data.totalPage || 0,
        totalElements: categoryData.data.totalElements || 0,
      };
    }

    // Agar to'g'ridan-to'g'ri array bo'lsa
    if (Array.isArray(categoryData.data)) {
      return {
        page: 0,
        size: 10,
        totalPage: 1,
        totalElements: categoryData.data.length,
      };
    }

    return { page: 0, size: 10, totalPage: 0, totalElements: 0 };
  };

  const createCategoryMutation = useMutation<
    CategoryActionResponse,
    Error,
    CreateCategoryDto
  >({
    mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES.ALL] });
      toast.success("Kategoriya muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Kategoriya qo'shishda xatolik yuz berdi");
      console.error("Create Category error:", error);
    },
  });

  const updateCategoryMutation = useMutation<
    CategoryActionResponse,
    Error,
    UpdateCategoryDto
  >({
    mutationFn: (data: UpdateCategoryDto) => categoryService.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORIES.ALL],
        exact: false,
      });
      toast.success("Kategoriya muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("Kategoriya yangilashda xatolik yuz berdi");
      console.error("Update Category error:", error);
    },
  });

  const deleteCategoryMutation = useMutation<
    CategoryActionResponse,
    Error,
    number | string
  >({
    mutationFn: (categoryId: number | string) =>
      categoryService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORIES.ALL],
        exact: false,
      });
      toast.success("Kategoriya muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Kategoriya o'chirishda xatolik yuz berdi");
      console.error("Delete Category error:", error);
    },
  });

  return {
    categories: getCategoriesData(),
    pagination: getPaginationData(),

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,

    // Loading states
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};