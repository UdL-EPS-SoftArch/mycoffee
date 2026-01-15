"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { clientAuthProvider } from "@/lib/authProvider";
import { BusinessService } from "@/api/businessApi";
import { BusinessEntity } from "@/types/business";

export default function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user } = useAuth();
    const [id, setId] = useState<string>("");

    const resolvedParams = use(params);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<BusinessEntity>>({
        name: "",
        address: "",
        openingTime: "",
        closingTime: "",
        capacity: 0,
        hasWifi: false,
    });

    useEffect(() => {
        setId(resolvedParams.id);
        const loadBusiness = async () => {
            try {
                const authProvider = clientAuthProvider();
                const service = new BusinessService(authProvider);
                const business = await service.getBusinessById(resolvedParams.id);

                setFormData({
                    name: business.name,
                    address: business.address,
                    openingTime: business.openingTime?.slice(0, 5) || "",
                    closingTime: business.closingTime?.slice(0, 5) || "",
                    capacity: business.capacity,
                    hasWifi: business.hasWifi,
                    email: business.email,
                    username: business.username
                });
            } catch (err: any) {
                console.error("Failed to load business", err);
                setError("Failed to load business details.");
            } finally {
                setLoading(false);
            }
        };
        loadBusiness();
    }, [resolvedParams]);

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

            const payload = { ...formData };

            if (payload.openingTime && payload.openingTime.length === 5) {
                payload.openingTime = `${payload.openingTime}:00`;
            }
            if (payload.closingTime && payload.closingTime.length === 5) {
                payload.closingTime = `${payload.closingTime}:00`;
            }

            if (!payload.password) delete payload.password;

            await service.updateBusiness(id, payload);
            router.push("/business");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to update business");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-12">
            <main className="mx-auto w-full max-w-2xl px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Edit Cafe
                    </h1>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
