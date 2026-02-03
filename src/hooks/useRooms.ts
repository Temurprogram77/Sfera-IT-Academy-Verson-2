import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { roomService } from "../services/roomService";
import {
  Room,
  CreateRoomDto,
  UpdateRoomDto,
  CreateRoomResponse,
  DeleteRoomResponse,
} from "../types/room";
import { QUERY_KEYS } from "../types/queryKeys";
import { toast } from "sonner";

interface UseRoomsReturn {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;

  createRoom: (
    data: CreateRoomDto,
    options?: { onSuccess?: () => void },
  ) => void;
  isCreating: boolean;

  updateRoom: (
    data: UpdateRoomDto,
    options?: { onSuccess?: () => void },
  ) => void;
  isUpdating: boolean;

  deleteRoom: (roomId: string | number) => void;
  isDeleting: boolean;
}

export const useRooms = (search: string = ""): UseRoomsReturn => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.ROOMS.ALL, search],
    queryFn: () => roomService.getRooms(search),

    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation<CreateRoomResponse, Error, CreateRoomDto>({
    mutationFn: (data: CreateRoomDto) => roomService.createRoom(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROOMS.ALL],
        });

        toast.success("Room created successfully");
      }
    },
    onError: () => {
      toast.error("Failed to create room");
    },
  });

  const updateMutation = useMutation<DeleteRoomResponse, Error, UpdateRoomDto>({
    mutationFn: (data: UpdateRoomDto) => roomService.updateRoom(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
        toast.success("Room updated successfully");
      }
    },
    onError: () => {
      toast.error("Failed to update room");
    },
  });

  const deleteMutation = useMutation<
    DeleteRoomResponse,
    Error,
    string | number
  >({
    mutationFn: (roomId: string | number) => roomService.deleteRoom(roomId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROOMS.ALL });
        toast.success("Room deleted successfully");
      }
    },
    onError: () => {
      toast.error("Failed to delete room");
    },
  });

  return {
    rooms: data?.data || [],
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
    isRefetching,

    createRoom: (data, options) => createMutation.mutate(data, options),
    isCreating: createMutation.isPending,

    updateRoom: (data, options) => updateMutation.mutate(data, options),
    isUpdating: updateMutation.isPending,

    deleteRoom: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
