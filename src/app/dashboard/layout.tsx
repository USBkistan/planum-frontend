import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/web/app-sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-h-100vh mx-4 my-2 w-full">{children}</div>
    </SidebarProvider>
  );
}
