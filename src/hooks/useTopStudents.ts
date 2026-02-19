import { useQuery } from "@tanstack/react-query";
import { topStudentsService } from "../services/topStudentsService";
import { TopStudent } from "../types/topStudents";
import { QUERY_KEYS } from "../types/queryKeys";

interface UseTopStudentsReturn {
  students: TopStudent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTopStudents = (): UseTopStudentsReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.TOP_STUDENTS,
    queryFn: () => topStudentsService.getTopStudents(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    students: data?.data || [],
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
};