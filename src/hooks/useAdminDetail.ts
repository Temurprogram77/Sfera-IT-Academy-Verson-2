// hooks/useAdminDetail.ts
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { AdminResponse } from "../types/admin";
import { QUERY_KEYS } from "../types/queryKeys";

export const useAdminDetail = (adminId: string | number | undefined) => {
  const {
    data: adminData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<AdminResponse, Error>({
    queryKey: [QUERY_KEYS.ADMIN.DETAIL, adminId],
    queryFn: () => adminService.getAdminById(adminId!),
    enabled: !!adminId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    admin: adminData?.data || null,
    loading: isLoading,
    error,
    refetch,
    isRefetching,
  };
};