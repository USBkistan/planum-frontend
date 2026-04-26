import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

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
          <Link href={"/dashboard/board"}>
            <h1 className="text-3xs font-bold">Доска задач</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link href={"/dashboard/vault"}>
            <h1 className="text-3xs font-bold">Хранилище</h1>
          </Link>
        </SidebarGroup>
        <SidebarGroup>
          <Link href={"/dashboard/chat"}>
            <h1 className="text-3xs font-bold">Чат</h1>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
