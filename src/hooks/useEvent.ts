import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventService } from "../services/eventService";
import { QUERY_KEYS } from "../types/queryKeys";
import { IEvent, ICreateEvent, IUpdateEvent } from "../types/event";

// Barcha eventlarni olish uchun hook
export const useEvents = () => {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<IEvent[], Error>({
    queryKey: QUERY_KEYS.EVENTS.LIST,
    queryFn: () => eventService.getAllEvents(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const createEventMutation = useMutation({
    mutationFn: (data: ICreateEvent) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.BY_DATE });
      toast.success("Event muvaffaqiyatli yaratildi!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Event yaratishda xatolik!");
      console.error("Create Event error:", error);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: (data: IUpdateEvent) => eventService.updateEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.BY_DATE });
      toast.success("Event muvaffaqiyatli yangilandi!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Event yangilashda xatolik!");
      console.error("Update Event error:", error);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: number | string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS.BY_DATE });
      toast.success("Event muvaffaqiyatli o'chirildi!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Event o'chirishda xatolik!");
      console.error("Delete Event error:", error);
    },
  });

  return {
    events,
    loading: isLoading,
    error,
    refetch,
    isRefetching,

    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,

    createEventAsync: createEventMutation.mutateAsync,
    updateEventAsync: updateEventMutation.mutateAsync,
    deleteEventAsync: deleteEventMutation.mutateAsync,

    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
};

// Muayyan sana uchun eventlarni olish
export const useEventsByDate = (
  date: string | null,
  isModalVisible: boolean = false
) => {
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<IEvent[], Error>({
    queryKey: [...QUERY_KEYS.EVENTS.BY_DATE, date],
    queryFn: () => eventService.getEventsByDate(date!),
    enabled: !!date && isModalVisible,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    events,
    loading: isLoading,
    error,
    refetch,
    isRefetching,
  };
};