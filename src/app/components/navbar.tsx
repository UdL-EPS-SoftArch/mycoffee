"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";
import { UserIcon } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
        { href: "/baskets", label: "Baskets" },
        { href: "/business", label: "Business", roles: ["ROLE_USER"] },
        { href: "/inventory", label: "Inventory", roles: ["ROLE_BUSINESS"] },
        { href: "/users", label: "Users", roles: ["ROLE_USER"] },
        { href: "/customer/register", label: "Register" },
        { href: "/customer", label: "Users", roles: ["ROLE_USER"] },
        { href: "/customer/login", label: "Users", roles: ["ROLE_USER"] },
    ];

    return (
        <nav className="bg-white border-b shadow-sm dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
                <div className="flex gap-2 font-bold w-auto">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={80}
                        height={16}
                        priority
                    /> Template
                </div>

                <div className="flex gap-4">
                    {navLinks
                        .filter(({ roles }) =>
                            !roles || user?.authorities?.some(
                                userAuth => roles.includes(userAuth.authority)))
                        .map(({ href, label }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={
                                        active
                                            ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
                                            : "text-gray-600 hover:text-gray-900 transition"
                                    }
                                >
                                    {label}
                                </Link>
                            );
                        })}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    {/* Botón de Perfil - Solo visible si el usuario está logueado */}
                    {user && (
                        <Link
                            href="/profile"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                pathname === "/profile"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            <span className="font-medium">Profile</span>
                        </Link>
                    )}

                    <Loginbar />
                </div>
            </div>
        </nav>
    );
}