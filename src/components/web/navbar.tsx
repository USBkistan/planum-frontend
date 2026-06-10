"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "../ui/button";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth()!;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    const groupId = Cookies.get("group_id");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!groupId || groupId === "null") {
      router.push("/group");
      return;
    }

    router.push("/dashboard/board");
  };

  if (!isReady) return null;

  return (
    <nav className="flex w-full items-center justify-between py-5">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">Planum</h1>
        </Link>
        {isAuthenticated && (
          <Button onClick={handleDashboardClick} className={buttonVariants({ variant: "ghost" })}>
            Доска
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <Button
            variant={"secondary"}
            onClick={() => {
              logout();
            }}
          >
            Выйти
          </Button>
        ) : (
          <>
            <Link className={buttonVariants()} href={"/auth/register"}>
              Регистрация
            </Link>
            <Link className={buttonVariants({ variant: "secondary" })} href={"/auth/login"}>
              Войти
            </Link>
          </>
        )}
        <ThemeToggle size={"icon"} />
      </div>
    </nav>
  );
}
