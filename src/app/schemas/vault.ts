export interface VaultItem {
    id: string;
    name: string;
    type: "folder" | "file";
    createdAt: Date;
    size?: number;
}

export interface VaultFolder {
    id: string | null;
    name: string | null;
    items: VaultItem[];
}
