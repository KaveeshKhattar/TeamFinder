import { BASE_URL } from "@/config";
import { useChat } from "@/lib/useChat";
import axios from "axios";
import { SendHorizontal, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const ChatWindow: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { messages, send } = useChat(roomId);

  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => {
        setCurrentUserId(r.data.data.id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return (
        "Yesterday " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      await send(text);
      setText("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <MessageCircle className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  No messages yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Send a message to start the conversation
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => {
                  const isCurrentUser = m.senderId === currentUserId;

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2",
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        
                      </div>

                      <div
                        className={cn(
                          "flex max-w-[75%] flex-col sm:max-w-[70%]",
                          isCurrentUser ? "items-end" : "items-start"
                        )}
                      >
                        

                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm shadow-sm",
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          <span className="break-words whitespace-pre-wrap">
                            {m.content}
                          </span>
                        </div>

                        <span className="mt-0.5 px-1 text-xs text-muted-foreground">
                          {formatTime(m.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <Separator />

          <div className="shrink-0 p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!text.trim() || sending}
                aria-label="Send message"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};