// hooks/useStudentDetail.ts
import { useQuery } from "@tanstack/react-query";
import { studentService } from "../services/studentService";
import { StudentResponse } from "../types/student";
import { QUERY_KEYS } from "../types/queryKeys";

export const useStudentDetail = (studentId: string | number | undefined) => {
  const {
    data: studentData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<StudentResponse, Error>({
    queryKey: [QUERY_KEYS.STUDENTS.DETAIL, studentId],
    queryFn: () => studentService.getStudentById(studentId!),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    student: studentData?.data || null,
    loading: isLoading,
    error,
    refetch,
    isRefetching,
  };
};