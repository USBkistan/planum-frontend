"use client";

import Cookies from "js-cookie";
import { Copy, Eye, EyeOff, LogOut } from "lucide-react";
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
      showMessage("error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      updateNameRequest(name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("success", "Name updated successfully");
    } catch (error) {
      showMessage("error", "Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("error", "All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      updatePasswordRequest(newPassword);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showMessage("success", "Password changed successfully");
    } catch (error) {
      showMessage("error", "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGroupCode = () => {
    navigator.clipboard.writeText(groupCode);
    showMessage("success", "Group code copied to clipboard");
  };

  const handleLeaveGroup = async () => {
    setLoading(true);
    try {
      await leaveGroupRequest();
      Cookies.remove("group_id");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showMessage("success", "You have left the group");
      router.push("/");
    } catch (error) {
      showMessage("error", "Failed to leave group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
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
            <CardTitle className="text-lg">Change Name</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <Button onClick={handleChangeName} disabled={loading}>
              Save Name
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
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
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Group Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Group Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Group Code */}
            <div className="space-y-2">
              <Label>Group Code</Label>
              <div className="flex gap-2">
                <Input value={groupCode} readOnly placeholder="Group code not available" />
                <Button onClick={handleCopyGroupCode} variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Leave Group Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={loading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Leave Group?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave this group? This action cannot be undone.
                </AlertDialogDescription>
                <div className="flex gap-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveGroup}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave Group
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
