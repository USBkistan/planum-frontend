export interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'directory';
    size?: number; // in bytes, only for files
    createdAt: Date;
    modifiedAt: Date;
    path: string;
    parentId?: string | null;
    extension?: string; // for files only
}

export interface StorageItem extends FileItem {
    type: 'directory';
}

export interface StorageFile extends FileItem {
    type: 'file';
    size: number;
    extension: string;
}
