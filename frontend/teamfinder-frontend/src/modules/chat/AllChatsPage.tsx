import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ChatRoomList } from "./ChatRoomList";
import { ChatWindow } from "./ChatWindow";
import Header from "../landingPage/components/Header";

export function AllChatsPage() {
  const [params, setParams] = useSearchParams();
  const selectedRoomId = params.get("room");

  const handleSelectRoom = (roomId: string) => {
    setParams({ room: roomId });
  };

  return (
    <>
      <Header />
      <div className="flex justify-center p-4">
        <Card className="flex h-[calc(100vh-5rem)] w-full max-w-4xl overflow-hidden border-border bg-card shadow-sm">
          <ChatRoomList
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
          {selectedRoomId ? (
            <ChatWindow roomId={selectedRoomId} />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center border-l border-border bg-muted/30 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Select a conversation
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose a chat from the sidebar or start a new one
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
