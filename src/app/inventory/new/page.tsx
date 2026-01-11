"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { InventoryService } from "@/api/inventoryApi";
import { clientAuthProvider } from "@/lib/authProvider";
import Link from "next/link";
import {
    ArrowLeft,
    Box,
    Info,
    Layout,
    MapPin,
    Plus,
    Save,
    Activity,
    Maximize2
} from "lucide-react";

export default function NewInventoryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        capacity: "",
        type: "WAREHOUSE",
        status: "ACTIVE",
    });

    if (!user) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Please login as BUSINESS.</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const service = new InventoryService(clientAuthProvider());
            await service.createInventory({
                name: formData.name,
                description: formData.description,
                location: formData.location,
                capacity: formData.capacity ? Number(formData.capacity) : undefined,
                type: formData.type as any,
                status: formData.status as any,
            });

            router.push("/inventory");
        } catch (err) {
            setError((err as Error).message);
            console.error("Error creating inventory", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8 animate-in fade-in slide-in-from-left duration-500">
                <Link
                    href="/inventory"
                    className="group flex items-center gap-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/20">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Add New Item</h1>
                        <p className="text-zinc-400 text-sm">Fill in the details to expand your stock locations.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <Layout size={14} />
                                Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50"
                                placeholder="Ex: Premium Arabica Coffee"
                            />
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <MapPin size={14} />
                                Location *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50"
                                placeholder="Ex: Warehouse A, Shelf 3"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <Box size={14} />
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50 appearance-none cursor-pointer"
                            >
                                <option value="WAREHOUSE">Warehouse</option>
                                <option value="SHELF">Shelf</option>
                                <option value="FRIDGE">Fridge</option>
                                <option value="DISPLAY">Display</option>
                                <option value="BACKROOM">Backroom</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <Activity size={14} />
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50 appearance-none cursor-pointer"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="FULL">Full</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        {/* Capacity */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <Maximize2 size={14} />
                                Max Capacity
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50"
                                placeholder="Leave empty if unlimited"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-2 px-1">
                                <Info size={14} />
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-2xl dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none bg-zinc-50 min-h-[120px]"
                                placeholder="Optional details about this inventory location..."
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6">
                        <Link
                            href="/inventory"
                            className="flex-1 px-6 py-4 rounded-2xl text-center font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-3 flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-xl shadow-black/10 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Inventory
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
