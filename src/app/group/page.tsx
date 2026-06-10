"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createGroupRequest, inviteToGroupRequest } from "@/services/groups";

export default function GroupPage() {
  const router = useRouter();
  const [createGroupName, setCreateGroupName] = useState("");
  const [joinGroupCode, setJoinGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createGroupName.trim()) {
      showMessage("error", "Имя группы не может быть пустым");
      return;
    }

    setLoading(true);
    try {
      await createGroupRequest({ name: createGroupName });
      showMessage("success", "Группа создана успешно!");
      setCreateGroupName("");
      router.push("/dashboard/board");
    } catch (error) {
      console.log(error);
      showMessage("error", "Не удалось создать группу");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinGroupCode.trim()) {
      showMessage("error", "Код группы не может быть пустым");
      return;
    }

    setLoading(true);
    try {
      await inviteToGroupRequest({ code: joinGroupCode });
      showMessage("success", "Вы успешно присоединились к группе!");
      setJoinGroupCode("");
      router.push("/dashboard/board");
    } catch (error) {
      showMessage("error", "Неверный код группы или не удалось присоединиться");
    } finally {
      setLoading(false);
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
