import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

export default function GroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href={"/"} className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft className="size-4" />
          Назад
        </Link>
      </div>
      <div className="max-auto w-full max-w-md">{children}</div>
    </div>
  );
}
