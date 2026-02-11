import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "../services/studentService";
import {
  StudentListResponse,
  CreateStudentDto,
  UpdateStudentDto,
  StudentActionResponse,
  StudentListParams,
} from "../types/student";
import { QUERY_KEYS } from "../types/queryKeys";

export const useStudents = (params?: StudentListParams) => {
  const queryClient = useQueryClient();

  const {
    data: StudentData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<StudentListResponse, Error>({
    queryKey: [QUERY_KEYS.STUDENTS.ALL, params],
    queryFn: () => studentService.getStudents(params),
    staleTime: 1000 * 60 * 5,
  });

  const createStudentMutation = useMutation<
    StudentActionResponse,
    Error,
    CreateStudentDto
  >({
    mutationFn: (data: CreateStudentDto) => studentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUPS.ALL],
      });
      toast.success("Student muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("Student qo'shishda xatolik yuz berdi");
      console.error("Create student error:", error);
    },
  });

  const updateStudentMutation = useMutation<
    StudentActionResponse,
    Error,
    UpdateStudentDto
  >({
    mutationFn: (data: UpdateStudentDto) => studentService.updateStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS.ALL] });
      toast.success("Student updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Student yangilashda xatolik yuz berdi.");
      console.error("Update student error:", error);
    },
  });

  const deleteStudentMutation = useMutation<
    StudentActionResponse,
    Error,
    number | string
  >({
    mutationFn: (studentId: number | string) =>
      studentService.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GROUPS.ALL],
      });
      toast.success("Student muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("Student o'chirishda xatolik yuz berdi");
      console.error("Delete student error:", error);
    },
  });

  return {
    students: StudentData?.data?.body || [],
    pagination: {
      page: StudentData?.data?.page || 0,
      size: StudentData?.data?.size || 10,
      totalPage: StudentData?.data?.totalPage || 0,
      totalElements: StudentData?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    // Mutations
    createStudent: createStudentMutation.mutate,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,

    // Loading states
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
  };
};
