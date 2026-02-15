// hooks/useMarks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markService } from "../services/marksService";
import {
  MarkListResponse,
  CreateMarkDto,
  UpdateMarkDto,
  MarkActionResponse,
  MarkListParams,
} from "../types/marks";
import { QUERY_KEYS } from "../types/queryKeys";

export const useMarks = (params?: MarkListParams) => {
  const queryClient = useQueryClient();

  const {
    data: markData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<MarkListResponse, Error>({
    queryKey: [QUERY_KEYS.MARKS.ALL, params],
    queryFn: () => markService.getMarks(params),
    staleTime: 1000 * 60 * 5,
  });

  console.log("Mark API Response:", markData);

  const createMarkMutation = useMutation<
    MarkActionResponse,
    Error,
    CreateMarkDto
  >({
    mutationFn: (data: CreateMarkDto) => markService.createMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKS.ALL] });
      toast.success("Baho muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Baho qo'shishda xatolik yuz berdi");
      console.error("Create Mark error:", error);
    },
  });

  const updateMarkMutation = useMutation<
    MarkActionResponse,
    Error,
    UpdateMarkDto
  >({
    mutationFn: (data: UpdateMarkDto) => markService.updateMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MARKS.ALL],
        exact: false,
      });
      toast.success("Baho muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("Baho yangilashda xatolik yuz berdi");
      console.error("Update Mark error:", error);
    },
  });

  const deleteMarkMutation = useMutation<
    MarkActionResponse,
    Error,
    number | string
  >({
    mutationFn: (markId: number | string) => markService.deleteMark(markId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MARKS.ALL],
        exact: false,
      });
      toast.success("Baho muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Baho o'chirishda xatolik yuz berdi");
      console.error("Delete Mark error:", error);
    },
  });

  return {
    marks: markData?.data?.body || [],
    pagination: {
      page: markData?.data?.page || 0,
      size: markData?.data?.size || 10,
      totalPage: markData?.data?.totalPage || 0,
      totalElements: markData?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createMark: createMarkMutation.mutate,
    updateMark: updateMarkMutation.mutate,
    deleteMark: deleteMarkMutation.mutate,

    // Loading states
    isCreating: createMarkMutation.isPending,
    isUpdating: updateMarkMutation.isPending,
    isDeleting: deleteMarkMutation.isPending,
  };
};