import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login"); // Redirect to the login page
        }
    }, [router]);

    return <>{children}</>;
}