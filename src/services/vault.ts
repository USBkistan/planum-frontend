import { VaultFolder } from "@/app/schemas/vault";

import { privateApiClient } from "./private";

export async function getVault(folderId: string | null): Promise<VaultFolder> {
    const path = folderId ? `/vault/dir?dir_id=${folderId}` : "/vault/dir";
    const { data } = await privateApiClient.get(path);
    console.log(data);
    return data!;
}

export async function createFolder({
    parentId,
    name,
}: {
    parentId: string | null;
    name: string;
}) {
    try {
        await privateApiClient.post("/vault/dir", { parent_id: parentId, name: name });
    } catch (error) {
        console.log(error);
    }
}
