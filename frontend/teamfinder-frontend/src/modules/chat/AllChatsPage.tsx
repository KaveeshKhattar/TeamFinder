import { useSearchParams } from "react-router-dom";
import { ChatRoomList } from "./ChatRoomList";
import { ChatWindow } from "./ChatWindow";
import Header from "../landingPage/components/Header";

export function AllChatsPage() {
  const [params, setParams] = useSearchParams();
  const selectedRoomId = params.get("room");

  const handleSelectRoom = (roomId: string) => {
    setParams({ room: roomId }); // updates URL, triggers re-render
  };

  return (
    <>
      <Header />
      <div className="flex max-w-5xl mx-auto justify-center">
        <ChatRoomList
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
        />

        {selectedRoomId && <ChatWindow roomId={selectedRoomId} />}
      </div>
    </>
  );
}
