"use client";

import { Button } from "@/components/ui/button";
import { getMeRequest } from "@/services/user";
import { useState } from "react";

interface User {
  id: string,
  email: string,
  display_name: string,
  created_at: string,
  updated_at: string,
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | undefined>(undefined);

  async function onClick() {
    const user = await getMeRequest()
    setUser(user);
  }

  return (
    <div>
      {user && <div>{user.display_name}</div>}
      <Button variant={"default"} onClick={onClick}>Get me</Button>
    </div>
  )
}
