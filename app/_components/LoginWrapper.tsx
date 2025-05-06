"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
