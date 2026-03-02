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
  ArchiveMarksParams,
  ArchiveMarksResponse,
} from "../types/assessment";

// ─────────────────────────────────────────────────────────────────
// useAssessment — Guruh bo'yicha baholar + to'liq CRUD
// ─────────────────────────────────────────────────────────────────
export const useAssessment = (
  groupId: number | string,
  params?: AssessmentsByGroupParams
) => {
  const queryClient = useQueryClient();

  // GET: Guruh bo'yicha baholarni olish
  const query = useQuery<AssessmentsByGroupResponse, Error>({
    queryKey: [...QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId), params],
    queryFn: () => assessmentService.getAssessmentsByGroup(groupId, params),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 2, // 2 daqiqa
  });

  // CREATE: Yangi baho qo'shish
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

  // UPDATE: Bahoni yangilash
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

  // DELETE: Bahoni o'chirish
  const deleteAssessmentMutation = useMutation<
    DeleteAssessmentResponse,
    Error,
    number // assessment id
  >({
    mutationFn: (id) => assessmentService.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ASSESSMENTS.ALL,
      });
      toast.success("Baho muvaffaqiyatli o'chirildi");
    },
    onError: () => {
      toast.error("Baho o'chirishda xatolik yuz berdi");
    },
  });

  return {
    // query natijalari
    assessments: query.data?.data?.body || [],
    pagination: {
      page: query.data?.data?.page || 0,
      size: query.data?.data?.size || 10,
      totalPage: query.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.totalElements || 0,
    },

    // holatlar
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,

    // mutations
    createAssessment: createAssessmentMutation.mutateAsync,
    isCreating: createAssessmentMutation.isPending,

    updateAssessment: updateAssessmentMutation.mutateAsync,
    isUpdating: updateAssessmentMutation.isPending,

    deleteAssessment: deleteAssessmentMutation.mutate,
    deleteAssessmentAsync: deleteAssessmentMutation.mutateAsync,
    isDeleting: deleteAssessmentMutation.isPending,
  };
};

// ─────────────────────────────────────────────────────────────────
// useArchiveMarks — Arxivdagi baholar (GET /mark/groups/:groupId/archive-marks)
// ─────────────────────────────────────────────────────────────────
export const useArchiveMarks = (
  groupId: number | string,
  params?: ArchiveMarksParams,
  enabled = false
) => {
  const query = useQuery<ArchiveMarksResponse, Error>({
    queryKey: [...QUERY_KEYS.ASSESSMENTS.BY_GROUP(groupId), "archive", params],
    queryFn: () => assessmentService.getArchiveMarksByGroup(groupId, params),
    enabled: !!groupId && enabled,
    staleTime: 1000 * 60 * 5, // 5 daqiqa
  });

  return {
    archiveMarks: query.data?.data?.body || [],
    pagination: {
      page: query.data?.data?.page || 0,
      size: query.data?.data?.size || 10,
      totalPage: query.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.totalElements || 0,
    },
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};

// ─────────────────────────────────────────────────────────────────
// useMyMarks — O'z baholarim (o'qituvchi/talaba/ota-ona)
// ─────────────────────────────────────────────────────────────────
export const useMyMarks = (params?: MyMarksParams) => {
  const query = useQuery<MyMarksResponse, Error>({
    queryKey: [...QUERY_KEYS.MARKS.ALL, "myMarks", params],
    queryFn: () => assessmentService.getMyMarks(params),
    staleTime: 1000 * 60 * 2, // 2 daqiqa
  });

  return {
    myMarks: query.data?.data?.body || [],
    pagination: {
      page: query.data?.data?.page || 0,
      size: query.data?.data?.size || 10,
      totalPage: query.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.totalElements || 0,
    },
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};