import { useQuery } from "@tanstack/react-query";

import { userService } from "../services/userService";
import { UserProfileResponse, User } from "../types/user";
import { QUERY_KEYS } from "../types/queryKeys";

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<UserProfileResponse, Error>({
    queryKey: QUERY_KEYS.USER.PROFILE,

    queryFn: async () => {
      return await userService.getProfile();
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    user: data?.data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
    isRefetching,
  };
};
