"use client";

import Link from "next/link";

import { Button, buttonVariants } from "../ui/button";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()!;

  return (
    <nav className="flex w-full items-center justify-between py-5">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">Planum</h1>
        </Link>
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
