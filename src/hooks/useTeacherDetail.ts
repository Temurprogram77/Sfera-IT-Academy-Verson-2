import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { TeacherDetailResponse } from "../types/teacher";
import { QUERY_KEYS } from "../types/queryKeys";

export const useTeacherDetail = (
  teacherId: string | number | undefined
) => {
  const {
    data: teacherData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<TeacherDetailResponse, Error>({
    queryKey: teacherId
      ? QUERY_KEYS.TEACHERS.DETAIL(teacherId)
      : ["teachers", "detail"],
    queryFn: () => teacherService.getTeacherById(teacherId!),
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    teacher: teacherData?.data || null,
    loading: isLoading,
    error,
    refetch,
    isRefetching,
  };
};
