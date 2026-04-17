import { SubmitEvent, useState } from "react";

interface AuthFormProps {
    mode: "Вход" | "Регистрация";
    onSubmit: (data: { username: string; password: string, displayName: string }) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        onSubmit({ username: email, password, displayName });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center">{mode}</h2>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div>
            {mode === "Регистрация" ? <div>
                <label className="block text-gray-700 dark:text-gray-300">
                    Name
                </label>
                <input
                    type="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            </div> : <></>}
            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
                {mode}
            </button>
        </form>
    );
}
