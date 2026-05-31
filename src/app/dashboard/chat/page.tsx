"use client";

import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ChatMessage } from "@/app/schemas/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "user-1",
      senderName: "Alice",
      content: "Hey, how are you?",
      timestamp: new Date(Date.now() - 5000),
    },
    {
      id: "2",
      sender: "user-2",
      senderName: "Bob",
      content: "I'm doing great! How about you?",
      timestamp: new Date(Date.now() - 3000),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [currentUser] = useState("user-1");
  const [currentUserName] = useState("Alice");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      senderName: currentUserName,
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
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
                  className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-semibold ${message.sender === currentUser ? "text-right" : "text-left"} text-gray-600`}
                    >
                      {message.senderName}
                    </p>
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.sender === currentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.sender === currentUser ? "text-blue-100" : "text-gray-600"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
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
