// hooks/useMark.ts
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

  const { data, isLoading, error, refetch } = useQuery<MyMarksResponse, Error>({
    queryKey: [...QUERY_KEYS.MARKS.ALL, "myMarks", params],
    queryFn: () => markService.getMyMarks(params),
    staleTime: 1000 * 60 * 5,
  });

  const createMarkMutation = useMutation<CreateMarkResponse, Error, CreateMarkDto>({
    mutationFn: (dto) => markService.createMark(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKS.ALL });
      toast.success("Baho muvaffaqiyatli qo'shildi");
    },
    onError: () => {
      toast.error("Baho qo'shishda xatolik yuz berdi");
    },
  });

  const updateMarkMutation = useMutation<UpdateMarkResponse, Error, UpdateMarkDto>({
    mutationFn: (dto) => markService.updateMark(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKS.ALL });
      toast.success("Baho muvaffaqiyatli yangilandi");
    },
    onError: () => {
      toast.error("Baho yangilashda xatolik yuz berdi");
    },
  });

  const deleteMarkMutation = useMutation<DeleteMarkResponse, Error, number>({
    mutationFn: (id) => markService.deleteMark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKS.ALL });
      toast.success("Baho muvaffaqiyatli o'chirildi");
    },
    onError: () => {
      toast.error("Baho o'chirishda xatolik yuz berdi");
    },
  });

  return {
    marks: data?.data?.body || [],
    pagination: {
      page: data?.data?.page || 0,
      size: data?.data?.size || 10,
      totalPage: data?.data?.totalPage || 0,
      totalElements: data?.data?.totalElements || 0,
    },
    loading: isLoading,
    error,
    refetch,

    createMark: createMarkMutation.mutateAsync,
    isCreating: createMarkMutation.isPending,

    updateMark: updateMarkMutation.mutateAsync,
    isUpdating: updateMarkMutation.isPending,

    deleteMark: deleteMarkMutation.mutate,
    isDeleting: deleteMarkMutation.isPending,
  };
};