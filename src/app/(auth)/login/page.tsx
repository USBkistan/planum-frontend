'use client';

import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { useState } from "react"

export default function Login() {
    const [message, setMessage] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleLogin = async (data: { username: string; password: string }) => {
        const res = await fetch(`http://127.0.0.1:8000/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        setMessage(result.message);

        if (res.status === 200) {
            setIsSuccessful(true);
        } else {
            setIsSuccessful(false);
        }
    };

    return (
        <div>
            {isSuccessful ? (
                <p className="text-green-500 text-center text-lg font-semibold">
                    Welcome!
                </p>
            ) : (
                <>
                    <AuthForm mode="Вход" onSubmit={handleLogin} />
                    <Link href="/register">
                        <p className="text-center text-blue-500 font-bold underline py-4">
                            Create a new account
                        </p>
                    </Link>
                </>
            )}
            {message && (
                <p
                    className={`text-center mt-4 ${isSuccessful ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    )
}
