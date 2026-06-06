import { VaultFolder } from "@/app/schemas/vault";

import { privateApiClient } from "./private";

export async function getVaultFolder(folderId: string | null): Promise<VaultFolder> {
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

export async function uploadFiles(files: FileList, folderId: string | null) {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    if (folderId) formData.append("folder_id", folderId);

    await privateApiClient.post("/vault/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
