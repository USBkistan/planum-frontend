"use client";

import Cookies from "js-cookie";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ChatMessage } from "@/app/schemas/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getChatMessages, sendChatMessage } from "@/services/chat";
import { wsServerUrl } from "@/services/globals";
import { getMeRequest } from "@/services/user";

export default function ChatPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentIUserName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const access_token = Cookies.get("access_token")!;
    const ws = new WebSocket(`${wsServerUrl}/messages?token=${access_token}`);

    ws.onopen = () => console.log("Connected to server");

    ws.onmessage = (event) => {
      console.log(event.data);
    };

    ws.onclose = () => console.log("Disconnected from server");

    setSocket(ws);

    const fetchData = async () => {
      try {
        const messages = await getChatMessages();
        setMessages(messages);

        const user = await getMeRequest();
        setCurrentUser(user.id);
        setCurrentIUserName(user.display_name);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };

    fetchData();

    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // const newMessage: ChatMessage = {
    //   id: Date.now().toString(),
    //   sender: currentUser,
    //   senderName: currentUserName,
    //   content: inputValue,
    //   timestamp: new Date(),
    // };
    await sendChatMessage(inputValue);

    // setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col p-6">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === currentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-semibold ${message.user_id === currentUser ? "text-right" : "text-left"} text-gray-600`}
                    >
                      {message.name}
                    </p>
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.user_id === currentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.user_id === currentUser ? "text-blue-100" : "text-gray-600"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <ScrollBar />
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
