import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { roomService } from "../services/roomService";
import { RoomResponse } from "../types/room";
import { QUERY_KEYS } from "../types/queryKeys";

interface UseRoomIdReturn {
  room: any | null; // agar Room type bo‘lsa, almashtiring
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRoomId = (
  roomId: string | number
): UseRoomIdReturn => {
  const {
    data,
    isLoading,
    error,
    refetch,
  }: UseQueryResult<RoomResponse, Error> = useQuery({
    queryKey: QUERY_KEYS.ROOMS.DETAIL(roomId),
    queryFn: () => roomService.getRoomById(roomId),
    enabled: !!roomId,
  });

  return {
    room: data?.data || null,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
};