// hooks/useSimpleTeachers.ts
import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { QUERY_KEYS } from "../types/queryKeys";
import { TeachersResponse, Teacher, TeacherListParams } from "../types/teacher";

interface UseSimpleTeachersReturn {
  teachers: Teacher[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export function useSimpleTeachers(params?: TeacherListParams): UseSimpleTeachersReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<TeachersResponse>({
    queryKey: [QUERY_KEYS.TEACHERS.TEACHERS_SIMPLE, params],
    queryFn: () => teacherService.getListTeachers(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    teachers: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}