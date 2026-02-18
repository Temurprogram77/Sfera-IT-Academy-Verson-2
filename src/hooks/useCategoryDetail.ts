import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/category";

export const useCategoryDetail = (id: string | number | undefined) => {
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = useQuery<Category, Error>({
    queryKey: ["category", "detail", id],
    queryFn: async () => {
      const response = await categoryService.getCategoryById(id!);
      // getCategoryById CategoryResponse qaytaradi — response.data.data
      return (response as any)?.data ?? response;
    },
    enabled: !!id,
    staleTime: 60_000,
  });

  return {
    category: category ?? null,
    loading: isLoading,
    error,
    refetch,
  };
};