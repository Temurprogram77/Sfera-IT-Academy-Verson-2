import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import {
  CreateTeacherDto,
  CreateTeacherResponse,
  TeacherListParams,
  UpdateTeacherDto,
  UpdateTeacherResponse,
  DeleteTeacherResponse,
} from "../types/teacher";
import { QUERY_KEYS } from "../types/queryKeys";
import { toast } from "sonner";

export const useTeacher = (params?: TeacherListParams) => {
  const queryClient = useQueryClient();

  // Get Teachers Query
  const {
    data: teachersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TEACHERS, params],
    queryFn: () => teacherService.getTeachers(params),
    staleTime: 1000 * 60 * 5, // 5 daqiqa
  });

  // Create Teacher Mutation
  const createTeacherMutation = useMutation<
    CreateTeacherResponse,
    Error,
    CreateTeacherDto
  >({
    mutationFn: (data: CreateTeacherDto) => teacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
    },
    onError: (error: Error) => {
      toast.error("O'qituvchi qo'shishda xatolik yuz berdi");
      console.error("Create teacher error:", error);
    },
  });

  // Update Teacher Mutation
  const updateTeacherMutation = useMutation<
    UpdateTeacherResponse,
    Error,
    UpdateTeacherDto
  >({
    mutationFn: (data: UpdateTeacherDto) => teacherService.updateTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
      toast.success("O'qituvchi muvaffaqiyatli yangilandi");
    },
    onError: (error: Error) => {
      toast.error("O'qituvchi yangilashda xatolik yuz berdi");
      console.error("Update teacher error:", error);
    },
  });

  // Delete Teacher Mutation
  const deleteTeacherMutation = useMutation<
    DeleteTeacherResponse,
    Error,
    number
  >({
    mutationFn: (teacherId: number) => teacherService.deleteTeacher(teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHERS] });
      toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
    },
    onError: (error: Error) => {
      toast.error("O'qituvchi o'chirishda xatolik yuz berdi");
      console.error("Delete teacher error:", error);
    },
  });

  return {
    // Get Teachers
    teachers: teachersData?.data?.body || [],
    pagination: {
      page: teachersData?.data?.page || 0,
      size: teachersData?.data?.size || 10,
      totalPage: teachersData?.data?.totalPage || 0,
      totalElements: teachersData?.data?.totalElements || 0,
    },
    isLoading,
    error,
    refetch,

    // Create Teacher
    createTeacher: createTeacherMutation.mutate,
    isCreating: createTeacherMutation.isPending,

    // Update Teacher
    updateTeacher: updateTeacherMutation.mutate,
    isUpdating: updateTeacherMutation.isPending,

    // Delete Teacher
    deleteTeacher: deleteTeacherMutation.mutate,
    isDeleting: deleteTeacherMutation.isPending,
  };
};
