"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import { User } from "@/app/login/loginModels";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    const updateUser = () => {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsedUser = User.fromJson(JSON.parse(rawUser));
        if (parsedUser) {
          setUser(parsedUser);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    updateUser();
  }, [pathname]); // Re-run effect whenever the route changes

  // Hide navbar on the login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-[var(--color-bg-light)] text-[var(--color-text)] shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">SIA Amazzy</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-[var(--color-accent)]">
              Home
            </Link>
          </li>
          {user?.isAdmin && (
            <li>
              <Link
                href="/scheduling/create"
                className="hover:text-[var(--color-accent)]"
              >
                Scheduling Create
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/scheduling/list"
              className="hover:text-[var(--color-accent)]"
            >
              Scheduling List
            </Link>
          </li>
          {user?.isAdmin && (
            <li>
              <Link
                href="/orders/create"
                className="hover:text-[var(--color-accent)]"
              >
                Create Order
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/orders/list"
              className="hover:text-[var(--color-accent)]"
            >
              Orders List
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-[var(--color-accent)] cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
