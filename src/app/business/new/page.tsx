"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { clientAuthProvider } from "@/lib/authProvider";
import { BusinessService } from "@/api/businessApi";
import { BusinessEntity } from "@/types/business";

export default function NewBusinessPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<BusinessEntity>({
        username: "",
        email: "",
        password: "",
        name: "",
        address: "",
        openingTime: "08:00",
        closingTime: "20:00",
        capacity: 20,
        hasWifi: true,
        rating: 0,
    });


    if (!user?.authorities?.some(a => ["ROLE_ADMIN", "ROLE_BUSINESS"].includes(a.authority))) {
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const authProvider = clientAuthProvider();
            const service = new BusinessService(authProvider);

            const payload = {
                ...formData,
                openingTime: formData.openingTime?.length === 5 ? `${formData.openingTime}:00` : formData.openingTime,
                closingTime: formData.closingTime?.length === 5 ? `${formData.closingTime}:00` : formData.closingTime,
            };

            await service.createBusiness(payload);
            router.push("/business");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create business");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-12">
            <main className="mx-auto w-full max-w-2xl px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Add New Cafe
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Register a new business and its owner account.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Owner Account Info</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                    placeholder="unique-cafe-id"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                    placeholder="cafe@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 dark:text-white pt-2">Cafe Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cafe Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                placeholder="e.g. The Coffee House"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                placeholder="e.g. 123 Main St"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    name="openingTime"
                                    required
                                    value={formData.openingTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    name="closingTime"
                                    required
                                    value={formData.closingTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 items-center">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Capacity (People)
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    required
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition dark:bg-black dark:border-zinc-700 dark:text-white dark:focus:ring-white"
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="hasWifi"
                                            checked={formData.hasWifi}
                                            onChange={handleChange}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-black checked:bg-black dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-white dark:checked:border-white"
                                        />
                                        <svg
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 dark:text-black transition-opacity"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            width="12"
                                            height="12"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Free Wi-Fi Available
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4 border-t border-gray-100 dark:border-zinc-800 mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800 w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Create Cafeteria"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
