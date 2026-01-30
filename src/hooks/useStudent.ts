import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "../services/studentService";
import {
  StudentListResponse,
  CreateStudentDto,
  CreateParentDto,
  UpdateStudentDto,
  StudentActionResponse,
} from "../types/student";
import { QUERY_KEYS } from "../types/queryKeys";

export const useStudents = () => {
  const queryClient = useQueryClient();

  // GET ALL STUDENTS
  const { data, isLoading, error, refetch, isRefetching } = useQuery<
    StudentListResponse,
    Error
  >({
    queryKey: QUERY_KEYS.STUDENTS.ALL,
    queryFn: () => studentService.getStudents(),
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });

  // CREATE STUDENT
  const createMutation = useMutation<
    StudentActionResponse,
    Error,
    CreateStudentDto
  >({
    mutationFn: (data: CreateStudentDto) => studentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL });
      toast.success("Student created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create student";
      toast.error(errorMessage);
    },
  });

  // CREATE PARENT
  const createParentMutation = useMutation<
    StudentActionResponse,
    Error,
    CreateParentDto
  >({
    mutationFn: (data: CreateParentDto) => studentService.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL });
      toast.success("Parent created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create parent";
      toast.error(errorMessage);
    },
  });

  // UPDATE STUDENT
  const updateMutation = useMutation<
    StudentActionResponse,
    Error,
    UpdateStudentDto
  >({
    mutationFn: (data: UpdateStudentDto) => studentService.updateStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL });
      toast.success("Student updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update student";
      toast.error(errorMessage);
    },
  });

  // DELETE STUDENT
  const deleteMutation = useMutation<
    StudentActionResponse,
    Error,
    number | string
  >({
    mutationFn: (id: number | string) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS.ALL });
      toast.success("Student deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete student";
      toast.error(errorMessage);
    },
  });

  return {
    // Data
    students: data?.data?.body || [],
    pagination: {
      page: data?.data?.page || 0,
      size: data?.data?.size || 10,
      totalPage: data?.data?.totalPage || 0,
      totalElements: data?.data?.totalElements || 0,
    },

    // States
    loading: isLoading,
    error: error?.message || null,
    refetch,
    isRefetching,

    // Mutations
    createStudent: createMutation.mutate,
    createParent: createParentMutation.mutate,
    updateStudent: updateMutation.mutate,
    deleteStudent: deleteMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isCreatingParent: createParentMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};