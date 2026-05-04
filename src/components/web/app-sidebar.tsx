"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { buttonVariants } from "../ui/button";

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
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
      <SidebarFooter />
    </Sidebar>
  );
}
