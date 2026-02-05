import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "../services/roomService";
import {
  CreateRoomDto,
  UpdateRoomDto,
  CreateRoomResponse,
  DeleteRoomResponse,
  UseRoomsReturn,
  RoomListParams,
} from "../types/room";
import { QUERY_KEYS } from "../types/queryKeys";
import { toast } from "sonner";


export const useRooms = (params?: RoomListParams): UseRoomsReturn => {
  const queryClient = useQueryClient();

  const { data: RoomData, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.ROOMS, params],
    queryFn: () => roomService.getRooms(params),

    placeholderData: (previousData) => previousData,
  });

  const createRoomMutation = useMutation<CreateRoomResponse, Error, CreateRoomDto>({
    mutationFn: (data: CreateRoomDto) => roomService.createRoom(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROOMS],
          exact: false,
        });

        toast.success("Room created successfully");
      }
    },
    onError: () => {
      toast.error("Failed to create room");
    },
  });

  const updateRoomMutation = useMutation<DeleteRoomResponse, Error, UpdateRoomDto>({
    mutationFn: (data: UpdateRoomDto) => roomService.updateRoom(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROOMS],
          exact: false,
        });
        toast.success("Room updated successfully");
      }
    },
    onError: () => {
      toast.error("Failed to update room");
    },
  });

  const deleteRoomMutation = useMutation<
    DeleteRoomResponse,
    Error,
    string | number
  >({
    mutationFn: (roomId: string | number) => roomService.deleteRoom(roomId),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ROOMS],
          exact: false,
        });

        toast.success("Room deleted successfully");
      }
    },
    onError: () => {
      toast.error("Failed to delete room");
    },
  });

  return {
    rooms: RoomData?.data || [],
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
    isRefetching,

    createRoom: (data, options) => createRoomMutation.mutate(data, options),
    isCreating: createRoomMutation.isPending,

    updateRoom: (data, options) => updateRoomMutation.mutate(data, options),
    isUpdating: updateRoomMutation.isPending,

    deleteRoom: deleteRoomMutation.mutate,
    isDeleting: deleteRoomMutation.isPending,
  };
};
