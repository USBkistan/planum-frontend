"use client";

import Cookies from "js-cookie";
import { Copy, Check, Eye, EyeOff, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInviteCodeRequest, leaveGroupRequest } from "@/services/groups";
import { getMeRequest, updateNameRequest, updatePasswordRequest } from "@/services/user";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const code = await getInviteCodeRequest();
      setGroupCode(code);

      const user = await getMeRequest();
      setName(user.display_name);
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangeName = async () => {
    if (!name.trim()) {
      showMessage("error", "Имя не может быть пустым");
      return;
    }

    setLoading(true);
    try {
      updateNameRequest(name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("success", "Имя успешно обновлено");
    } catch (error) {
      showMessage("error", "Не удалось обновить имя");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("error", "Все поля обязательны для заполнения");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("error", "Пароли не совпадают");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("error", "Пароль должен содержать как минимум 8 символов");
      return;
    }

    setLoading(true);
    try {
      updatePasswordRequest(newPassword);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showMessage("success", "Пароль успешно изменен");
    } catch (error) {
      showMessage("error", "Не удалось изменить пароль");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGroupCode = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(groupCode);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = groupCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      showMessage("success", "Код группы скопирован в буфер обмена");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      showMessage("error", "Не удалось скопировать код группы");
    }
  };

  const handleLeaveGroup = async () => {
    setLoading(true);
    try {
      await leaveGroupRequest();
      Cookies.remove("group_id");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("success", "Вы покинули группу");
      router.push("/group");
    } catch (error) {
      showMessage("error", "Не удалось покинуть группу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-gray-600">Управление вашей учетной записью</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid max-w-2xl gap-6">
        {/* Change Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Изменить имя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
              />
            </div>
            <Button onClick={handleChangeName} disabled={loading}>
              Изменить имя
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Изменить пароль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль (минимум 8 символов)"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердить пароль</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Подтвердите новый пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-2.5 right-3 text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button onClick={handleChangePassword} disabled={loading}>
              Изменить пароль
            </Button>
          </CardContent>
        </Card>

        {/* Group Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Настройки группы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Group Code */}
            <div className="space-y-2">
              <Label>Код группы</Label>
              <div className="flex gap-2">
                <Input value={groupCode} readOnly placeholder="Код группы недоступен" />
                <Button
                  onClick={handleCopyGroupCode}
                  variant="outline"
                  size="icon"
                  title="Копировать код"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Leave Group Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={loading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Покинуть группу
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Покинуть группу?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите покинуть группу? Вы потеряете доступ ко всем данным и
                  задачам, связанным с этой группой. Это действие нельзя отменить.
                </AlertDialogDescription>
                <div className="flex gap-3">
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveGroup}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Покинуть группу
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
