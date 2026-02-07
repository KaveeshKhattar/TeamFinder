import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, BROKER_URL } from "@/config";
import { ChatMessage } from "@/types";

export function useChat(roomId: string) {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const clientRef = useRef<Client | null>(null);

  console.log("room id: ", roomId)

  // 1. load history
  useEffect(() => {

    const token = localStorage.getItem("token");

    setMessages([]); // important when switching rooms

    axios.get<ChatMessage[]>(
      `${BASE_URL}/api/chats/${roomId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => {
      setMessages(res.data);
    });

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
  function send(content: string) {

    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        chatRoomId: roomId,
        content
      })
    });
  }

  return { messages, send };
}
