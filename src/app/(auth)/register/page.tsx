'use client';

import { registerRequest } from "@/services/auth";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { useState } from "react"

export default function Login() {
    const [message, setMessage] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleLogin = async (data: { username: string; password: string, displayName: string }) => {
        const res = await registerRequest(
            {
                email: data.username,
                password: data.password,
                display_name: data.displayName
            }
        );

        const result = await res.json();
        setMessage(result.message);

        if (res.status === 201) {
            setIsSuccessful(true);
            localStorage["access_token"] = result.access_token;
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
                    <AuthForm mode="Регистрация" onSubmit={handleLogin} />
                    <Link href="/login">
                        <p className="text-center text-blue-500 font-bold underline py-4">
                            Войти если есть аккаунт
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
