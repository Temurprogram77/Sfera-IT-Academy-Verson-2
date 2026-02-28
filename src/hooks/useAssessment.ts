// hooks/useAssessment.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assessmentService } from "../services/assessmentService";
import { QUERY_KEYS } from "../types/queryKeys";
import type {
  AssessmentsByGroupParams,
  AssessmentsByGroupResponse,
  MyMarksParams,
  MyMarksResponse,
  CreateAssessmentDto,
  CreateAssessmentResponse,
  UpdateAssessmentDto,
  UpdateAssessmentResponse,
  DeleteAssessmentResponse,
} from "../types/assessment";

// ─────────────────────────────────────────────────────────────────
// useAssessment
// Guruh bo'yicha baholar + to'liq CRUD
// ─────────────────────────────────────────────────────────────────
export const useAssessment = (
  groupId: number | string,
  params?: AssessmentsByGroupParams
) => {
  const queryClient = useQueryClient();

  // ── GET: Guruh baholarini olish ──────────────────────────────
  const { data, isLoading, error, refetch } = useQuery<
    AssessmentsByGroupResponse,
    Error
  >({
    queryKey: [...QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId), params],
    queryFn: () => assessmentService.getAssessmentsByGroup(groupId, params),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 2,
  });

  // ── POST: Yangi baho qo'shish ────────────────────────────────
  const createAssessmentMutation = useMutation<
    CreateAssessmentResponse,
    Error,
    CreateAssessmentDto
  >({
    mutationFn: (dto) => assessmentService.createAssessment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.ALL,
      });
      toast.success("Baho muvaffaqiyatli qo'shildi");
    },
    onError: () => {
      toast.error("Baho qo'shishda xatolik yuz berdi");
    },
  });

  // ── PUT: Bahoni yangilash ────────────────────────────────────
  const updateAssessmentMutation = useMutation<
    UpdateAssessmentResponse,
    Error,
    UpdateAssessmentDto
  >({
    mutationFn: (dto) => assessmentService.updateAssessment(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.ALL,
      });
      toast.success("Baho muvaffaqiyatli yangilandi");
    },
    onError: () => {
      toast.error("Baho yangilashda xatolik yuz berdi");
    },
  });

  // ── DELETE: Bahoni o'chirish ─────────────────────────────────
  const deleteAssessmentMutation = useMutation<
    DeleteAssessmentResponse,
    Error,
    number
  >({
    mutationFn: (id) => assessmentService.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId),
      });
      toast.success("Baho muvaffaqiyatli o'chirildi");
    },
    onError: () => {
      toast.error("Baho o'chirishda xatolik yuz berdi");
    },
  });

  return {
    // ── Ma'lumotlar ─────────────────────────────────────────────
    assessments: data?.data?.body || [],
    pagination: {
      page: data?.data?.page || 0,
      size: data?.data?.size || 10,
      totalPage: data?.data?.totalPage || 0,
      totalElements: data?.data?.totalElements || 0,
    },
    loading: isLoading,
    error,
    refetch,

    // ── Mutatsiyalar ────────────────────────────────────────────
    createAssessment: createAssessmentMutation.mutateAsync,
    isCreating: createAssessmentMutation.isPending,

    updateAssessment: updateAssessmentMutation.mutateAsync,
    isUpdating: updateAssessmentMutation.isPending,

    deleteAssessment: deleteAssessmentMutation.mutate,
    isDeleting: deleteAssessmentMutation.isPending,
  };
};

// ─────────────────────────────────────────────────────────────────
// useMyMarks
// Teacher/Student/Parent o'z baholarini ko'rish uchun
// ─────────────────────────────────────────────────────────────────
export const useMyMarks = (params?: MyMarksParams) => {
  const { data, isLoading, error, refetch } = useQuery<MyMarksResponse, Error>({
    queryKey: [...QUERY_KEYS.MARKS.ALL, "myMarks", params],
    queryFn: () => assessmentService.getMyMarks(params),
    staleTime: 1000 * 60 * 2,
  });

  return {
    myMarks: data?.data?.body || [],
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