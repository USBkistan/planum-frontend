import { VaultFolder, VaultItem } from "@/app/schemas/vault";

import { privateApiClient } from "./private";

export async function getVaultFolder(folderId: string | null): Promise<VaultFolder> {
    const path = folderId ? `/vault/folder?folder_id=${folderId}` : "/vault/folder";
    const { data } = await privateApiClient.get(path);
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
        await privateApiClient.post("/vault/folder", {
            parent_id: parentId,
            name: name,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function downloadFile(file: VaultItem) {
    const response = await privateApiClient.get(
        `/vault/files/download?file_id=${file.id}`,
        {
            responseType: "blob",
        },
    );

    const blob = response.data;

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
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

export async function deleteFile(fileId: string) {
    await privateApiClient.delete(`/vault/files?file_id=${fileId}`);
}

export async function deleteFolder(folderId: string) {
    await privateApiClient.delete(`/vault/folder?folder_id=${folderId}`);
}
