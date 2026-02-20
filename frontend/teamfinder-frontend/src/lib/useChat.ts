import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, BROKER_URL } from "@/config";
import { ChatMessage } from "@/types";

export function useChat(roomId: string) {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const clientRef = useRef<Client | null>(null);
  const activeRoomRef = useRef(roomId);

  useEffect(() => {
    activeRoomRef.current = roomId;
  }, [roomId]);

  // 1. load history
  useEffect(() => {
    const token = localStorage.getItem("token");
    let cancelled = false;
    setHistoryLoading(true);

    axios
      .get<ChatMessage[]>(
        `${BASE_URL}/api/chats/${roomId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (!cancelled && activeRoomRef.current === roomId) {
          setMessages(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load chat history", err);
        if (!cancelled && activeRoomRef.current === roomId) {
          setMessages([]);
        }
      })
      .finally(() => {
        if (!cancelled && activeRoomRef.current === roomId) {
          setHistoryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

  }, [roomId]);

  // 2. connect websocket
  useEffect(() => {

    const token = localStorage.getItem("token");

    const client = new Client({
      brokerURL: `${BROKER_URL}`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {}
    });

    client.onConnect = () => {

      client.subscribe(
        `/topic/chat.${roomId}`,
        frame => {
          const msg: ChatMessage = JSON.parse(frame.body);

          setMessages(prev => [...prev, msg]);
        }
      );
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };

  }, [roomId]);

  // 3. send message
  function send(content: string): Promise<void> {

    const client = clientRef.current;
    if (!client?.connected) {
      return Promise.reject(new Error("Chat is not connected"));
    }

    const receipt = `send-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Message send timeout"));
      }, 5000);

      client.watchForReceipt(receipt, () => {
        clearTimeout(timeoutId);
        resolve();
      });

      client.publish({
        destination: "/app/chat.send",
        headers: { receipt },
        body: JSON.stringify({
          chatRoomId: roomId,
          content
        })
      });
    });
  }

  return { messages, historyLoading, send };
}
