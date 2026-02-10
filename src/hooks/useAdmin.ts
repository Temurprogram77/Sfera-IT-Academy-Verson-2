import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "../services/adminService";
import {
  AdminListResponse,
  CreateAdminDto,
  UpdateAdminDto,
  AdminActionResponse,
  AdminListParams,
} from "../types/admin";
import { QUERY_KEYS } from "../types/queryKeys";

export const useAdmins = (params?: AdminListParams) => {
  const queryClient = useQueryClient();

  const {
    data: AdminData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<AdminListResponse, Error>({
    queryKey: [QUERY_KEYS.ADMIN.ALL, params],
    queryFn: () => adminService.getAdmins(params),
    staleTime: 1000 * 60 * 5,
  });

  const createAdminMutation = useMutation<
    AdminActionResponse,
    Error,
    CreateAdminDto
  >({
    mutationFn: (data: CreateAdminDto) => adminService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN.ALL] });
      toast.success("Admin muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Admin qo'shishda xatolik yuz berdi");
      console.error("Create Admin error:", error);
    },
  });

  const updateAdminMutation = useMutation<
    AdminActionResponse,
    Error,
    UpdateAdminDto
  >({
    mutationFn: (data: UpdateAdminDto) => adminService.updateAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN.ALL],
        exact: false,
      });
      toast.success("Admin updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Admin yangilashda xatolik yuz berdi.");
      console.error("Update Admin error:", error);
    },
  });

  const deleteAdminMutation = useMutation<
    AdminActionResponse,
    Error,
    number | string
  >({
    mutationFn: (adminId: number | string) => adminService.deleteAdmin(adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN.ALL],
        exact: false,
      });
      toast.success("Admin muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Admin o'chirishda xatolik yuz berdi");
      console.error("Delete Admin error:", error);
    },
  });

  return {
    admins: AdminData?.data?.body || [],
    pagination: {
      page: AdminData?.data?.page || 0,
      size: AdminData?.data?.size || 10,
      totalPage: AdminData?.data?.totalPage || 0,
      totalElements: AdminData?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createAdmin: createAdminMutation.mutate,
    updateAdmin: updateAdminMutation.mutate,
    deleteAdmin: deleteAdminMutation.mutate,

    // Loading states
    isCreating: createAdminMutation.isPending,
    isUpdating: updateAdminMutation.isPending,
    isDeleting: deleteAdminMutation.isPending,
  };
};
