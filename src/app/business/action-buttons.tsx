"use client";

import Link from "next/link";
import { useAuth } from "@/app/components/authentication";

export function CreateBusinessButton() {
    const { user } = useAuth();

    const canCreate = user?.authorities?.some(
        a => ["ROLE_ADMIN"].includes(a.authority)
    );

    if (!canCreate) return null;

    return (
        <Link
            href="/business/new"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-sm shadow-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Cafes
        </Link>
    );
}

interface BusinessActionsProps {
    id: string;
    ownerId: string;
    onDelete: (id: string) => void;
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientAuthProvider } from "@/lib/authProvider";
import { BusinessService } from "@/api/businessApi";

export function BusinessActions({ id, ownerId, onDelete }: BusinessActionsProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const isAdmin = user?.authorities?.some(a => a.authority === "ROLE_ADMIN");
    const hasBusinessRole = user?.authorities?.some(a => a.authority === "ROLE_BUSINESS");
    const isOwner = user?.username === ownerId;

    const canEdit = isAdmin || (hasBusinessRole && isOwner);

    if (!canEdit) return null;

    const handleDeleteClick = () => {
        setIsConfirming(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const authProvider = clientAuthProvider();
            const service = new BusinessService(authProvider);
            await service.deleteBusiness(id);
            onDelete(id);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete business", error);
            alert("Failed to delete business");
        } finally {
            setIsDeleting(false);
            setIsConfirming(false);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirming(false);
    };

    return (
        <div className="flex gap-1 ml-auto relative">
            <Link href={`/business/${id}/edit`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition dark:hover:text-white dark:hover:bg-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </Link>
            <button
                onClick={handleDeleteClick}
                disabled={isDeleting || isConfirming}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition dark:hover:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>

            {isConfirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={handleCancelDelete}
                    ></div>

                    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Cafeteria</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to delete this cafeteria? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition flex items-center gap-2 shadow-lg shadow-red-600/20"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}