import { useEffect, useState } from "react";
import axios from "axios";
import { ChatRoom } from "@/types";
import { BASE_URL } from "@/config";

interface Props {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const ChatRoomList: React.FC<Props> = ({
  selectedRoomId,
  onSelectRoom,
}) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get<ChatRoom[]>(`${BASE_URL}/api/chats/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setRooms(r.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-80 border-r overflow-y-auto px-4">
      {rooms
        .filter((room) => room.id != null)
        .map((room) => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`p-3 cursor-pointer rounded-md ${
              room.id === selectedRoomId ? "dark:bg-gray-700 bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={room.otherUserPictureUrl}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <span>
                <p className="text-black dark:text-white">{room.otherUserName}</p>
                </span>
            </div>
          </div>
        ))}
    </div>
  );
};
