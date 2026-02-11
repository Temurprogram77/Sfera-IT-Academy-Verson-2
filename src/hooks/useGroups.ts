import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groupService } from "../services/groupService";
import {
  GroupListResponse,
  GroupAllResponse,
  GroupDaysResponse,
  CreateGroupDto,
  UpdateGroupDto,
  GroupActionResponse,
  GroupListParams,
  GroupDaysParams,
  GroupDetailResponse,
} from "../types/group";
import { QUERY_KEYS } from "../types/queryKeys";

export const useGroups = (params?: GroupListParams) => {
  const queryClient = useQueryClient();

  const {
    data: groupData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<GroupListResponse, Error>({
    queryKey: [QUERY_KEYS.GROUPS.ALL, params],
    queryFn: () => groupService.getGroups(params),
    staleTime: 1000 * 60 * 5,
  });

  const createGroupMutation = useMutation<
    GroupActionResponse,
    Error,
    CreateGroupDto
  >({
    mutationFn: (data: CreateGroupDto) => groupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GROUPS.ALL] });
      toast.success("Guruh muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Guruh qo'shishda xatolik yuz berdi");
      console.error("Create group error:", error);
    },
  });

  const updateGroupMutation = useMutation<
    GroupActionResponse,
    Error,
    UpdateGroupDto
  >({
    mutationFn: (data: UpdateGroupDto) => groupService.updateGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUPS.ALL],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUPS.DETAIL],
        exact: false,
      });
      toast.success("Guruh muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("Guruh yangilashda xatolik yuz berdi");
      console.error("Update group error:", error);
    },
  });

  const deleteGroupMutation = useMutation<
    GroupActionResponse,
    Error,
    number | string
  >({
    mutationFn: (groupId: number | string) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUPS.ALL],
        exact: false,
      });
      toast.success("Guruh muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Guruh o'chirishda xatolik yuz berdi");
      console.error("Delete group error:", error);
    },
  });

  return {
    groups: groupData?.data?.body || [],
    pagination: {
      page: groupData?.data?.page || 0,
      size: groupData?.data?.size || 10,
      totalPage: groupData?.data?.totalPage || 0,
      totalElements: groupData?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,

    // Loading states
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};

export const useAllGroups = () => {
  const { data, isLoading, error } = useQuery<GroupAllResponse, Error>({
    queryKey: [QUERY_KEYS.GROUPS.ALL_LIST],
    queryFn: () => groupService.getAllGroups(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    groups: data?.data || [],
    loading: isLoading,
    error,
  };
};

export const useGroupDetails = (groupId: string | number) => {
  const { data, isLoading, error, refetch } = useQuery<GroupDetailResponse, Error>({
    queryKey: [QUERY_KEYS.GROUPS.DETAIL(groupId)],
    queryFn: () => groupService.getGroupById(groupId),
    enabled: !!groupId && !isNaN(Number(groupId)),
    staleTime: 1000 * 60 * 5,
  });

  return {
    group: data?.data || null,
    students: data?.data?.students || [],
    loading: isLoading,
    error,
    refetch,
  };
};

export const useGroupDays = (params: GroupDaysParams, enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery<
    GroupDaysResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.GROUPS.DAYS, params],
    queryFn: () => groupService.getGroupDays(params),
    enabled: enabled && !!params.groupId && !!params.yearMonth,
    staleTime: 1000 * 60 * 5,
  });

  return {
    days: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};