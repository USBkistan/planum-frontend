import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { buttonVariants } from "../ui/button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">Planum</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link className={buttonVariants({ variant: "secondary" })} href={"/dashboard/board"}>
            <h1 className="text-3xs font-bold">Доска задач</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link className={buttonVariants({ variant: "secondary" })} href={"/dashboard/vault"}>
            <h1 className="text-3xs font-bold">Хранилище</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link className={buttonVariants({ variant: "secondary" })} href={"/dashboard/chat"}>
            <h1 className="text-3xs font-bold">Чат</h1>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
