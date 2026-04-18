'use client';

import { useState } from "react";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

export default function AuthProvider() {
    const [isLoged, setIsLoged] = useState(false);

    if (isLoged) {
        redirect("/dashboard");
    }

    return (
        <div>
            <Header setIsLoged={setIsLoged} />
            <main>
                Чтобы продлолжить войдите или зарегистрируйтесь
            </main>
        </div>
    )
}
