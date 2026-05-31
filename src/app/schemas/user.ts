import z from "zod";

export const userSchema = z.object({
    id: z.uuidv4(),
    group_id: z.uuidv4().nullable(),
    email: z.email(),
    display_name: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export const userChangeSchema = z.object({
    password: z.string().min(8).optional(),
});
