"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to board page
    router.push("/dashboard/board");
  }, [router]);

  return null;
}
