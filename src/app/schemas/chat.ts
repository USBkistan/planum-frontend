import z from "zod";

export type ChatMessage = z.infer<typeof messageSchema>;

export const messageSchema = z.object({
    id: z.uuidv4(),
    user_id: z.uuidv4(),
    group_id: z.uuidv4(),
    text: z.string(),
    name: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});
