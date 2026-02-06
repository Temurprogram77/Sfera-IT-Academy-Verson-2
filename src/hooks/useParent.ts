import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parentService } from "../services/parentService";
import {
  ParentListResponse,
  CreateParentDto,
  UpdateParentDto,
  ParentActionResponse,
  ParentListParams,
} from "../types/parent";
import { QUERY_KEYS } from "../types/queryKeys";

export const useParents = (params?: ParentListParams) => {
  const queryClient = useQueryClient();

  const { data: ParentData, isLoading, error, refetch, isRefetching } = useQuery<
    ParentListResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.PARENTS.ALL, params],
    queryFn: () => parentService.getParents(params),
    staleTime: 1000 * 60 * 5,
  });

  const createParentMutation = useMutation<
    ParentActionResponse,
    Error,
    CreateParentDto
  >({
    mutationFn: (data: CreateParentDto) => parentService.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARENTS.ALL] });
      toast.success("Parent muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Parent qo'shishda xatolik yuz berdi");
      console.error("Create parent error:", error)
    },
  });

  const updateParentMutation = useMutation<
    ParentActionResponse,
    Error,
    UpdateParentDto
  >({
    mutationFn: (data: UpdateParentDto) => parentService.updateParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARENTS.ALL] });
      toast.success("Parent updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Parent yangilashda xatolik yuz berdi.");console.error("Update parent error:", error);
    },
  });

  const deleteParentMutation = useMutation<
    ParentActionResponse,
    Error,
    number | string
  >({
    mutationFn: (parentId: number | string) => parentService.deleteParent(parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARENTS.ALL] });
      toast.success("Parent muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Parent o'chirishda xatolik yuz berdi");console.error("Delete parent error:", error);
    },
  });

  return {
    data: ParentData?.data?.totalElements,
    parents: ParentData?.data?.body || [],
    pagination: {
      page: ParentData?.data?.page || 0,
      size: ParentData?.data?.size || 10,
      totalPage: ParentData?.data?.totalPage || 0,
      totalElements: ParentData?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createParent: createParentMutation.mutate,
    updateParent: updateParentMutation.mutate,
    deleteParent: deleteParentMutation.mutate,

    // Loading states
    isCreating: createParentMutation.isPending,
    isUpdating: updateParentMutation.isPending,
    isDeleting: deleteParentMutation.isPending,
  };
};