import React from "react";
import { useParams } from "react-router";
import { useRoomId } from "../../hooks/useRoomsId";

const RoomsID = () => {
  const { id } = useParams();

  const { room, loading, error } = useRoomId(id!);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!room) return <p>Room topilmadi</p>;

  // console.log(room.schedules.map(item=>item));
  
  return (
    <div>
      <h2>{room.name}</h2>
      <p>{room.schedules}</p>
    </div>
  );
};

export default RoomsID;