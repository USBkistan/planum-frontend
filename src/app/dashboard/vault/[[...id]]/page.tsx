"use client";

import { Folder, File, Plus, Upload, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import type { VaultFolder, VaultItem } from "@/app/schemas/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createFolder, getVault } from "@/services/vault";

export default function VaultFolderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id === undefined ? null : (params.id as string);

  const [folder, setFolder] = useState<VaultFolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const folder = await getVault(id);
        setFolder(folder);
      } catch (error) {
        console.error("Failed to fetch vault:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, []);

  if (loading || !folder) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  // Sort items: folders first, then files, both alphabetically
  const sortedItems = [...folder.items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();

    if (!name) return;

    await createFolder({ parentId: id, name: name });

    const folder = await getVault(id);
    setFolder(folder);

    setNewFolderName("");
    setOpenPopover(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newFile: VaultItem = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        type: "file",
        createdAt: new Date(),
        size: file.size,
      };

      setFolder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: [...prev.items, newFile],
        };
      });
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setOpenPopover(null);
  };

  const handleOpenFolder = (childFolderId: string) => {
    router.push(`/dashboard/vault/${childFolderId}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const renderEmptyList = () => {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        <p>No items in this folder</p>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => item.type === "folder" && handleOpenFolder(item.id)}
            className={item.type === "folder" ? "cursor-pointer" : ""}
          >
            <Item variant="outline" className="hover:bg-accent p-3 transition-colors">
              <ItemMedia variant="icon" className="text-blue-500">
                {item.type === "folder" ? (
                  <Folder className="h-6 w-6" />
                ) : (
                  <File className="h-6 w-6" />
                )}
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle className="line-clamp-2 text-sm">{item.name}</ItemTitle>
                <p className="text-xs text-gray-500">
                  {item.type === "file" ? formatFileSize(item.size || 0) : "Folder"}
                </p>
              </ItemContent>
            </Item>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {folder.name !== null && (
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">{folder.name === null ? "Хранилище" : folder.name}</h1>
        </div>

        <div className="flex gap-2">
          {/* Create Folder */}
          <Popover
            open={openPopover === "folder"}
            onOpenChange={(open) => setOpenPopover(open ? "folder" : null)}
          >
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Create Folder</h4>
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateFolder();
                    }
                  }}
                />
                <Button onClick={handleCreateFolder} className="w-full" size="sm">
                  Create
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Upload File */}
          <Popover
            open={openPopover === "file"}
            onOpenChange={(open) => setOpenPopover(open ? "file" : null)}
          >
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Upload File</h4>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500">You can select multiple files at once</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Items List */}
      {sortedItems.length === 0 ? renderEmptyList() : renderList()}
    </div>
  );
}
