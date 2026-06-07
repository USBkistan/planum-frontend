"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="mb-6 text-5xl font-bold">Управляйте проектами вместе с командой</h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Современная платформа для совместной работы. Планируйте, общайтесь и отслеживайте прогресс
          в одном месте.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/auth/register")}>
            Начать
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
