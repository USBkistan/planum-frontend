import { ChatMessage, messageSchema } from "@/app/schemas/chat";

import { privateApiClient } from "./private";

export async function getChatMessages(): Promise<ChatMessage[]> {
    const { data } = await privateApiClient.get("/messages");
    return data.map((e: any) => messageSchema.decode(e));
}

export async function sendChatMessage(text: string) {
    await privateApiClient.post("/messages", { text: text });
}
