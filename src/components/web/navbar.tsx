"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "./auth-provider";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()!;

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">
            Planum
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href={"/dashboard"}>
            Настройки
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href={"/profile"}>
            Аккаунт
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {
          isAuthenticated ?
            <Button variant={"secondary"} onClick={() => { logout() }}>
              Выйти
            </Button>
            :
            <>
              <Link className={buttonVariants()} href={"/auth/register"}>
                Регистрация
              </Link>
              <Link className={buttonVariants({ variant: "secondary" })} href={"/auth/login"}>
                Войти
              </Link>
            </>
        }
        <ThemeToggle />
      </div>
    </nav>
  );
}
