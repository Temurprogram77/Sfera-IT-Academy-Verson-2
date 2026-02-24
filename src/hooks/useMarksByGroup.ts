// hooks/useMarksByGroup.ts
import { useQuery } from "@tanstack/react-query";
import { markService } from "../services/markService";
import { MarksByGroupParams, MarksByGroupResponse } from "../types/mark";
import { QUERY_KEYS } from "../types/queryKeys";

interface UseMarksByGroupOptions {
  groupId: number | string;
  keyword?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useMarksByGroup = ({
  groupId,
  keyword,
  page = 0,
  size = 10,
  enabled = true,
}: UseMarksByGroupOptions) => {
  const params: MarksByGroupParams = { page, size };
  if (keyword) params.keyword = keyword;

  const { data, isLoading, error, refetch } =
    useQuery<MarksByGroupResponse, Error>({
      queryKey: [...QUERY_KEYS.MARKS.ALL, "byGroup", groupId, params],
      queryFn: () => markService.getMarksByGroup(groupId, params),
      enabled: !!groupId && enabled,
      staleTime: 1000 * 60 * 2,
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
  };
};