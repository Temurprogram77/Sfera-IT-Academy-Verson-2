import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { toast } from "sonner";
import {
  CreateNotificationDto,
  CreateNotificationWithGroupDto,
  NotificationListParams,
  ReadNotificationDto,
} from "../types/notification";

const NOTIF_KEYS = {
  ALL: ["notifications"] as const,
  MY: ["notifications", "my"] as const,
  COUNT: ["notifications", "count"] as const,
  DETAIL: (id: number | string) => ["notifications", "detail", id] as const,
};

// ✅ Header uchun — count (student & parent)
export const useNotificationCount = () => {
  const role = localStorage.getItem("user_role");
  const isVisible = role === "ROLE_STUDENT" || role === "ROLE_PARENT";

  const { data, isLoading } = useQuery({
    queryKey: NOTIF_KEYS.COUNT,
    queryFn: () => notificationService.getCount(),
    enabled: isVisible,
    refetchInterval: 30 * 1000,
    staleTime: 1000 * 15,
  });

  return { count: data?.data ?? 0, isLoading };
};

// ✅ MessageSidebar & Messages page — student/parent uchun
export const useMyNotifications = () => {
  const role = localStorage.getItem("user_role");
  const isVisible = role === "ROLE_STUDENT" || role === "ROLE_PARENT";

  const { data, isLoading, refetch } = useQuery({
    queryKey: NOTIF_KEYS.MY,
    queryFn: () => notificationService.getMy(),
    enabled: isVisible,
    staleTime: 1000 * 60,
  });

  return {
    notifications: data?.data ?? [],
    isLoading,
    refetch,
  };
};

// ✅ Messages page — faqat ADMIN uchun (pagination bilan)
export const useAllNotifications = (params?: NotificationListParams) => {
  const role = localStorage.getItem("user_role");
  const isAdmin = role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN";

  const { data, isLoading, refetch } = useQuery({
    queryKey: [...NOTIF_KEYS.ALL, params],
    queryFn: () => notificationService.getAll(params),
    enabled: isAdmin,
    staleTime: 1000 * 60,
  });

  return {
    notifications: data?.data?.body ?? [],
    pagination: {
      page: data?.data?.page ?? 0,
      size: data?.data?.size ?? 10,
      totalPage: data?.data?.totalPage ?? 0,
      totalElements: data?.data?.totalElements ?? 0,
    },
    isLoading,
    refetch,
  };
};

// ✅ Modal uchun — getById
export const useNotificationById = (id: number | null) => {
  const { data, isLoading } = useQuery({
    queryKey: NOTIF_KEYS.DETAIL(id!),
    queryFn: () => notificationService.getById(id!),
    enabled: !!id,
  });

  return { notification: data?.data ?? null, isLoading };
};

// ✅ O'qildi — PUT /notification/read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReadNotificationDto) =>
      notificationService.markAsRead(data), // PUT ga ketadi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.MY });
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.COUNT });
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.ALL });
      toast.success("O'qildi deb belgilandi");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });
};

// ✅ Create (ADMIN)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationDto) =>
      notificationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.ALL });
      toast.success("Xabarnoma muvaffaqiyatli yuborildi");
    },
    onError: () => toast.error("Yuborishda xatolik"),
  });
};

// ✅ Create with group (ADMIN)
export const useCreateNotificationWithGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationWithGroupDto) =>
      notificationService.createWithGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.ALL });
      toast.success("Guruhga xabarnoma yuborildi");
    },
    onError: () => toast.error("Yuborishda xatolik"),
  });
};

// ✅ Delete (ADMIN)
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.ALL });
      toast.success("Xabarnoma o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik"),
  });
};
