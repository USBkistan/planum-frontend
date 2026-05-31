import { VaultFolder } from "@/app/schemas/vault";

const rootFolder: VaultFolder = {
    id: "e320c98b-b1a1-4677-8e8e-f389b4e50bb1",
    name: "Vault",
    items: [
        {
            id: "6d7d2f93-1a36-4fb5-a971-b2d99c0d1776",
            name: "Documents",
            type: "folder",
            createdAt: new Date(),
        },
        {
            id: "38f75403-a244-4e83-9a71-d96fa22e30ab",
            name: "Images",
            type: "folder",
            createdAt: new Date(),
        },
        {
            id: "2b1ec1cf-9ca7-4507-9f62-c10703b0ef37",
            name: "Report.pdf",
            type: "file",
            createdAt: new Date(),
            size: 2048,
        },
        {
            id: "8af6e639-d2d5-4ccd-ba15-81367efcc81d",
            name: "Budget.xlsx",
            type: "file",
            createdAt: new Date(),
            size: 1024,
        },
    ],
};

const documentsFolder: VaultFolder = {
    id: "6d7d2f93-1a36-4fb5-a971-b2d99c0d1776",
    name: "Documents",
    items: [
        {
            id: "945f1fd4-1838-4d5b-9dbd-76acca232fd7",
            name: "Project Plan.docx",
            type: "file",
            createdAt: new Date(),
            size: 5120,
        },
    ],
};

const imagesFolder: VaultFolder = {
    id: "38f75403-a244-4e83-9a71-d96fa22e30ab",
    name: "Images",
    items: [
        {
            id: "714bdea9-3c0a-4950-a2f8-e2bee9923336",
            name: "Logo.png",
            type: "file",
            createdAt: new Date(),
            size: 1024,
        },
    ],
};

let hashmap: Map<string | null, VaultFolder> = new Map();

hashmap.set(null, rootFolder);
hashmap.set("6d7d2f93-1a36-4fb5-a971-b2d99c0d1776", documentsFolder);
hashmap.set("38f75403-a244-4e83-9a71-d96fa22e30ab", imagesFolder);

export async function getVault(folderId: string | null): Promise<VaultFolder> {
    return hashmap.get(folderId)!;
}
