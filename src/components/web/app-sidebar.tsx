"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Button, buttonVariants } from "../ui/button";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar() {
  const { isAuthenticated, logout } = useAuth()!;
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname.includes(href);
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">Planum</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <Link
            className={buttonVariants({
              variant: isActive("/dashboard/board") ? "default" : "secondary",
            })}
            href={"/dashboard/board"}
          >
            <h1 className="text-3xs font-bold">Доска задач</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
            className={buttonVariants({
              variant: isActive("/dashboard/vault") ? "default" : "secondary",
            })}
            href={"/dashboard/vault"}
          >
            <h1 className="text-3xs font-bold">Хранилище</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
            className={buttonVariants({
              variant: isActive("/dashboard/chat") ? "default" : "secondary",
            })}
            href={"/dashboard/chat"}
          >
            <h1 className="text-3xs font-bold">Чат</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link
            className={buttonVariants({
              variant: isActive("/dashboard/settings") ? "default" : "secondary",
            })}
            href={"/dashboard/settings"}
          >
            <h1 className="text-3xs font-bold">Настройки</h1>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <ThemeToggle size={"default"} />
        </SidebarGroup>
        <SidebarGroup>
          <Button
            variant={"secondary"}
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Выйти
          </Button>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
