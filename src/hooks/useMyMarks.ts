import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { markService } from "../services/markService";
import {
  MyMarksParams,
  MyMarksResponse,
  CreateMarkDto,
  CreateMarkResponse,
  UpdateMarkDto,
  UpdateMarkResponse,
  DeleteMarkResponse,
} from "../types/mark";
import { QUERY_KEYS } from "../types/queryKeys";
import { toast } from "sonner";

export const useMark = (params?: MyMarksParams) => {
  const queryClient = useQueryClient();

  const {
    data: marksData,
    isLoading,
    error,
    refetch,
  } = useQuery<MyMarksResponse, Error>({
    queryKey: [QUERY_KEYS.MARKS, params],
    queryFn: () => markService.getMyMarks(params),
    staleTime: 1000 * 60 * 5,
  });

  const createMarkMutation = useMutation<CreateMarkResponse, Error, CreateMarkDto>({
    mutationFn: (data: CreateMarkDto) => markService.createMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKS] });
      toast.success("Baho muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Baho qo'shishda xatolik yuz berdi");
      console.error("Create mark error:", error);
    },
  });

  const updateMarkMutation = useMutation<UpdateMarkResponse, Error, UpdateMarkDto>({
    mutationFn: (data: UpdateMarkDto) => markService.updateMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKS] });
      toast.success("Baho muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("Baho yangilashda xatolik yuz berdi");
      console.error("Update mark error:", error);
    },
  });

  const deleteMarkMutation = useMutation<DeleteMarkResponse, Error, number>({
    mutationFn: (id: number) => markService.deleteMark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MARKS] });
      toast.success("Baho muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Baho o'chirishda xatolik yuz berdi");
      console.error("Delete mark error:", error);
    },
  });

  return {
    marks: marksData?.data?.body || [],
    pagination: {
      page: marksData?.data?.page || 0,
      size: marksData?.data?.size || 10,
      totalPage: marksData?.data?.totalPage || 0,
      totalElements: marksData?.data?.totalElements || 0,
    },
    loading: isLoading,
    error,
    refetch,

    createMark: createMarkMutation.mutate,
    isCreating: createMarkMutation.isPending,

    updateMark: updateMarkMutation.mutate,
    isUpdating: updateMarkMutation.isPending,

    deleteMark: deleteMarkMutation.mutate,
    isDeleting: deleteMarkMutation.isPending,
  };
};