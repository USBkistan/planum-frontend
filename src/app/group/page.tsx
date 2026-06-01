"use client";

import { Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GroupPage() {
  const router = useRouter();
  const [createGroupName, setCreateGroupName] = useState("");
  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createGroupName.trim()) {
      showMessage("error", "Group name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to create group
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setGeneratedCode(code);
      showMessage("success", "Group created successfully!");
      setCreateGroupName("");

      // Save to cookies and redirect after 2 seconds
      setTimeout(() => {
        document.cookie = `group_id=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
        router.push("/dashboard/board");
      }, 2000);
    } catch (error) {
      showMessage("error", "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinGroupCode.trim()) {
      showMessage("error", "Group code cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to join group with code
      showMessage("success", "Successfully joined the group!");
      setJoinGroupCode("");

      // Save to cookies and redirect after 2 seconds
      setTimeout(() => {
        document.cookie = `group_id=${joinGroupCode}; path=/; max-age=${60 * 60 * 24 * 365}`;
        router.push("/dashboard/board");
      }, 2000);
    } catch (error) {
      showMessage("error", "Invalid group code or failed to join");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Добро пожаловать!</h1>
        <p className="text-lg text-gray-600">
          Для начала работы создайте свою группу или вступите в уже созданную
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 w-full max-w-md rounded-lg px-4 py-3 ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Generated Code Display */}
      {generatedCode && (
        <Card className="mb-6 w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Ваш код группы:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-lg font-bold text-green-700">
                  {generatedCode}
                </code>
                <Button onClick={handleCopyCode} variant="outline" size="icon" className="shrink-0">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-600">Поделитесь этим кодом с членами вашей группы</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Управление группой</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 p-0">
              <TabsTrigger value="create">Создать группу</TabsTrigger>
              <TabsTrigger value="join">Вступить в группу</TabsTrigger>
            </TabsList>

            {/* Create Group Tab */}
            <TabsContent value="create" className="mt-4 space-y-4">
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Название группы</Label>
                  <Input
                    id="groupName"
                    placeholder="Введите название группы"
                    value={createGroupName}
                    onChange={(e) => setCreateGroupName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Создание..." : "Создать группу"}
                </Button>
              </form>
            </TabsContent>

            {/* Join Group Tab */}
            <TabsContent value="join" className="mt-4 space-y-4">
              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupCode">Код группы</Label>
                  <Input
                    id="groupCode"
                    placeholder="Введите код группы"
                    value={joinGroupCode}
                    onChange={(e) => setJoinGroupCode(e.target.value.toUpperCase())}
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Вступление..." : "Вступить в группу"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
