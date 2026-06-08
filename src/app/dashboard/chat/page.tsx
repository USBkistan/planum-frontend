"use client";

import Cookies from "js-cookie";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import React from "react";

import { ChatMessage } from "@/app/schemas/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChatMessages, sendChatMessage } from "@/services/chat";
import { wsServerUrl } from "@/services/globals";
import { getMeRequest } from "@/services/user";

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentGroup, setCurrentGroup] = useState("");
  const [currentUserName, setCurrentIUserName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const access_token = Cookies.get("access_token")!;
    const ws = new WebSocket(`${wsServerUrl}/messages?token=${access_token}`);

    ws.onopen = () => console.log("Connected to server");

    ws.onmessage = (event) => {
      try {
        const newMessage: ChatMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.log(event.data);
      }
    };

    ws.onclose = () => console.log("Disconnected from server");

    setSocket(ws);

    const fetchData = async () => {
      try {
        setLoading(true);
        const messages = await getChatMessages();
        setMessages(messages);

        const user = await getMeRequest();
        setCurrentUser(user.id);
        setCurrentGroup(user.group_id!);
        setCurrentIUserName(user.display_name);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: currentUser,
      group_id: currentGroup,
      name: currentUserName,
      text: inputValue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await sendChatMessage(inputValue);

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(newMessage));
      }

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDatetime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const renderMessages = () => {
    return (
      <>
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <div
              className={`flex ${message.user_id === currentUser ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-sm space-y-1">
                <p
                  className={`text-xs font-semibold ${
                    message.user_id === currentUser ? "text-right" : "text-left"
                  } text-gray-600`}
                >
                  {message.name}
                </p>
                <div
                  className={`rounded-lg px-4 py-2 wrap-break-word ${
                    message.user_id === currentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.user_id === currentUser ? "text-blue-100" : "text-gray-600"
                    }`}
                  >
                    {formatDatetime(new Date(message.created_at))}
                  </p>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="flex h-full flex-col p-6">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Чат</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-165 w-full">
              <div className="space-y-4 pr-4">
                {loading ? <div>Загрузка...</div> : renderMessages()}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Введите ваше сообщение..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
