// hooks/useParentDetail.ts
import { useQuery } from "@tanstack/react-query";
import { parentService } from "../services/parentService";
import { ParentResponse } from "../types/parent";
import { QUERY_KEYS } from "../types/queryKeys";

export const useParentDetail = (parentId: string | number | undefined) => {
  const {
    data: parentData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<ParentResponse, Error>({
    queryKey: [QUERY_KEYS.PARENTS.DETAIL, parentId],
    queryFn: () => parentService.getParentById(parentId!),
    enabled: !!parentId, // parentId mavjud bo'lgandagina fetch qiladi
    staleTime: 1000 * 60 * 5, // 5 daqiqa
  });

  return {
    parent: parentData?.data || null,
    loading: isLoading,
    error,
    refetch,
    isRefetching,
  };
};