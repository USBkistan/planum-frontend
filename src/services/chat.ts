import { ChatMessage } from "@/app/schemas/chat";

const data = [
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
];

export async function getChatMessages(): Promise<ChatMessage[]> {
    return data;
}
