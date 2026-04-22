import z from "zod";

export const userSchema = z.object({
    id: z.uuidv4(),
    email: z.email(),
    display_name: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});
