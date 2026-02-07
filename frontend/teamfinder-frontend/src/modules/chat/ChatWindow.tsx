import { BASE_URL } from "@/config";
import { useChat } from "@/lib/useChat";
import axios from "axios";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ChatWindow: React.FC<{ roomId: string; }> = ({ 
  roomId, 
}) => {
  const { messages, send } = useChat(roomId);

  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      setCurrentUserId(r.data.data.id);
      console.log("currentUserId from response:", r.data.data.id);
      setLoading(false);
    }).catch(err => {
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
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-md">

      {/* Messages Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800 max-h-96 rounded-md">
          
          {/* Empty State */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                <SendHorizontal className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Send a message to start the conversation</p>
            </div>
          ) : (
            <>
              {messages.map((m, index) => {
                const isCurrentUser = m.senderId === currentUserId;
                const showAvatar =
                  index === 0 || messages[index - 1].senderId !== m.senderId;

                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                            isCurrentUser 
                              ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                              : "bg-gradient-to-br from-purple-400 to-purple-600"
                          }`}
                        >
                          {getInitials(m.senderName)}
                        </div>
                      ) : (
                        <div className="w-8 h-8" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      } max-w-[75%] sm:max-w-[70%]`}
                    >
                      {!isCurrentUser && showAvatar && (
                        <div className="text-xs font-medium mb-1 px-1 text-gray-700 dark:text-gray-300">
                          {m.senderName}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-2 shadow-sm transition-colors ${
                          isCurrentUser
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-sm border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="text-sm break-words whitespace-pre-wrap">
                          {m.content}
                        </div>
                      </div>

                      <div className={`text-xs mt-1 px-1 ${
                        isCurrentUser 
                          ? "text-gray-500 dark:text-gray-400" 
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {formatTime(m.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-sm"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};