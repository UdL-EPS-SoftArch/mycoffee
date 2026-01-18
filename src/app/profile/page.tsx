"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";
import UserProfile from "@/app/components/UserProfile";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setIsLoading(true);

                const authProvider = clientAuthProvider();
                const service = new UsersService(authProvider);
                const currentUser = await service.getCurrentUser();

                if (!currentUser) {
                    router.push("/login");
                    return;
                }

                setUser(currentUser);
            } catch {
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUser();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Redirecting...
                    </p>
                </div>
            </div>
        );
    }

    return <UserProfile user={user} />;
}
