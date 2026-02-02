import { useQuery } from "@tanstack/react-query";
import { groupService } from "../services/groupService";
import { GroupListResponse } from "../types/group";
import { QUERY_KEYS } from "../types/queryKeys";

export const useGroups = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    GroupListResponse,
    Error
  >({
    queryKey: QUERY_KEYS.GROUPS.ALL,
    queryFn: () => groupService.getAllGroups(),
  });

  return {
    groups: data?.data || [],

    // States
    loading: isLoading,
    error: error?.message || null,
    refetch,
    isRefetching,
  };
};