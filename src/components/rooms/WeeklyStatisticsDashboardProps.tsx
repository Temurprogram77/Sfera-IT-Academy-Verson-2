import { useParams } from "react-router";
import { useRoomId } from "../../hooks/useRoomsId";
import WeeklyStatisticsDashboard from "./WeeklyStatisticsDashboard";
import { Spin, Alert } from "antd";

export const RoomStatisticsPage = () => {
  const params = useParams();
  const roomId = params.id as string;
  const { room, loading, error } = useRoomId(roomId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xatolik"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <WeeklyStatisticsDashboard
      weeklyStats={room?.weeklyStats || []}
      title="Xona Statistikasi"
      description={`${room?.name} uchun haftalik tahlil`}
    />
  );
};