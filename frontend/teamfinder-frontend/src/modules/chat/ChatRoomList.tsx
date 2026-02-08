import { useEffect, useState } from "react";
import axios from "axios";
import { ChatRoom } from "@/types";
import { BASE_URL } from "@/config";
import { cn } from "@/lib/utils";

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
    <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card min-h-0">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Messages</h2>
        <p className="text-xs text-muted-foreground">
          {rooms.length} conversation{rooms.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rooms
          .filter((room) => room.id != null)
          .map((room) => (
            <button
              type="button"
              key={room.id}
              onClick={() => onSelectRoom(room.id!)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-none border-0 px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                room.id === selectedRoomId &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <img
                src={room.otherUserPictureUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {room.otherUserName}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};
