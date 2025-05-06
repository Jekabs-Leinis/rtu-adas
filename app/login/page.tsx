"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./loginServices";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await loginUser(username, password);
        if (result.success) {
            router.push("/");
        } else {
            setError(result.error || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--background)] text-[var(--color-text)]">
            <div className="w-full max-w-sm p-6 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-[var(--color-text-light)]">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-semibold text-[var(--color-text)]"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 text-sm border rounded-lg bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)] focus:ring-[var(--color-accent)]"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-semibold text-[var(--color-text)]"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-sm border rounded-lg bg-[var(--color-bg-dark)] text-[var(--color-text)] border-[var(--color-border)] focus:ring-[var(--color-accent)]"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && (
                        <div className="mb-4 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-base font-medium text-[var(--color-text)] bg-[var(--color-accent)] border border-[var(--color-accent-dark)] rounded-lg hover:bg-[var(--color-accent-hover)] focus:ring-[var(--color-accent)]"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
