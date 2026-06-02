import z from "zod";

export const groupSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    description: z.string().nullable(),
    owner_id: z.uuidv4(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export interface GroupCreateData {
    name: string;
}

export interface GroupInviteData {
    code: string;
}
