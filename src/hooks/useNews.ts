// hooks/useNews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { newsService } from "../services/newsService";
import {
  NewsListParams,
  NewsListResponse,
  NewsResponse,
  NewsActionResponse,
  CreateNewsDto,
  UpdateNewsDto,
} from "../types/news";
import { QUERY_KEYS } from "../types/queryKeys";

export const useNews = (params?: NewsListParams) => {
  const queryClient = useQueryClient();

  const {
    data: newsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<NewsListResponse, Error>({
    queryKey: [QUERY_KEYS.NEWS.ALL, params?.page, params?.size, params?.search],
    queryFn: () => newsService.getNews(params),
    staleTime: 1000 * 60 * 5,
  });

  const createNewsMutation = useMutation<
    NewsActionResponse,
    Error,
    CreateNewsDto
  >({
    mutationFn: (data: CreateNewsDto) => newsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NEWS.ALL] });
      toast.success("Yangilik muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Yangilik qo'shishda xatolik yuz berdi");
      console.error("Create news error:", error);
    },
  });

  const updateNewsMutation = useMutation<
    NewsActionResponse,
    Error,
    UpdateNewsDto
  >({
    mutationFn: (data: UpdateNewsDto) => newsService.updateNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NEWS.ALL],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NEWS.DETAIL],
        exact: false,
      });
      toast.success("Yangilik muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("Yangilik yangilashda xatolik yuz berdi");
      console.error("Update news error:", error);
    },
  });

  const deleteNewsMutation = useMutation<
    NewsActionResponse,
    Error,
    number | string
  >({
    mutationFn: (newsId: number | string) => newsService.deleteNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NEWS.ALL],
        exact: false,
      });
      toast.success("Yangilik muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Yangilik o'chirishda xatolik yuz berdi");
      console.error("Delete news error:", error);
    },
  });

  return {
    news: newsData?.data || [],
    total: newsData?.data?.length || 0,

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createNews: createNewsMutation.mutate,
    updateNews: updateNewsMutation.mutate,
    deleteNews: deleteNewsMutation.mutate,

    // Loading states
    isCreating: createNewsMutation.isPending,
    isUpdating: updateNewsMutation.isPending,
    isDeleting: deleteNewsMutation.isPending,
  };
};

export const useNewsDetail = (newsId: string | number) => {
  const { data, isLoading, error, refetch } = useQuery<NewsResponse, Error>({
    queryKey: [QUERY_KEYS.NEWS.DETAIL, newsId],
    queryFn: () => newsService.getNewsById(newsId),
    enabled: !!newsId && !isNaN(Number(newsId)),
    staleTime: 1000 * 60 * 5,
  });

  return {
    news: data?.data || null,
    loading: isLoading,
    error,
    refetch,
  };
};
