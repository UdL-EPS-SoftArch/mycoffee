"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/authentication";
import { InventoryService } from "@/api/inventoryApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Inventory } from "@/types/inventory";
import Link from "next/link";
import {
    AlertTriangle,
    Box,
    ChevronRight,
    Clock,
    MapPin,
    Package,
    Plus,
    Settings,
    Trash2,
    CheckCircle2,
    XCircle,
    Thermometer,
    Minus
} from "lucide-react";

export default function InventoryPage() {
    const { user } = useAuth();
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        async function loadData() {
            if (user) {
                setLoading(true);
                setError(null);
                try {
                    const service = new InventoryService(clientAuthProvider());
                    const data = await service.getMyInventories(user);
                    setInventories(data);
                } catch (err) {
                    console.error("Error loading inventories", err);
                    setError((err as Error).message);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData();
    }, [user, refreshTrigger]);

    const handleDelete = async (inventory: Inventory) => {
        if (!window.confirm("Delete this inventory?")) return;

        try {
            const service = new InventoryService(clientAuthProvider());
            await service.deleteInventory(inventory);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Error deleting inventory", err);
            setError((err as Error).message);
        }
    };

    const handleAdjustStock = async (item: Inventory, delta: number) => {
        const newStock = (item.totalStock || 0) + delta;

        // Validation
        if (newStock < 0) return;
        if (item.capacity && newStock > item.capacity) return;

        // Optimistic UI update
        const originalInventories = [...inventories];
        const itemUrl = item._links?.self?.href;

        setInventories(inventories.map(i =>
            i._links?.self?.href === itemUrl
                ? Object.assign(i, { totalStock: newStock, lastUpdated: new Date().toISOString() })
                : i
        ));

        try {
            const service = new InventoryService(clientAuthProvider());
            await service.updateInventory(item, { totalStock: newStock });
        } catch (err) {
            console.error("Failed to update stock", err);
            // Revert on error
            setInventories(originalInventories);
            setError(`Failed to update stock: ${(err as Error).message}`);
        }
    };

    if (!user) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Please login as BUSINESS to view inventories.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">My Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor your stock levels efficiently.</p>
                </div>
                <Link
                    href="/inventory/new"
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg active:scale-95"
                >
                    <Plus size={18} />
                    Add Item
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div className="p-10 text-center text-gray-500">Loading inventories...</div>
            ) : inventories.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    <p>You have no items in the inventory.</p>
                    <Link href="/inventory/new" className="text-blue-600 hover:underline mt-2 inline-block">
                        Create one now →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {inventories.map((item) => (
                        <div
                            key={item._links?.self?.href || item.id}
                            className={`group relative border border-transparent p-6 rounded-3xl bg-white dark:bg-zinc-900 flex justify-between items-center hover:border-black/5 dark:hover:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 ${item.capacity && item.totalStock >= item.capacity ? 'ring-2 ring-orange-500/10 bg-gradient-to-br from-white to-orange-50/20' : ''
                                }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="font-black text-2xl tracking-tight text-zinc-800 dark:text-zinc-100">{item.name}</h2>
                                    {item.capacity && item.totalStock >= item.capacity && (
                                        <div className="flex items-center gap-1.5 text-orange-600 bg-orange-100 dark:bg-orange-950/40 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest animate-pulse">
                                            <AlertTriangle size={12} />
                                            Limit Reached
                                        </div>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 max-w-xl">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm items-center mb-6">
                                    {/* Status Badge */}
                                    {item.status && (
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-inset shadow-sm
                                            ${item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                                            ${item.status === 'FULL' ? 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                                            ${item.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                                            ${item.status === 'CLOSED' ? 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                                        `}>
                                            {item.status === 'ACTIVE' && <CheckCircle2 size={14} />}
                                            {item.status === 'FULL' && <AlertTriangle size={14} />}
                                            {item.status === 'MAINTENANCE' && <Settings size={14} />}
                                            {item.status === 'CLOSED' && <XCircle size={14} />}
                                            {item.status}
                                        </div>
                                    )}

                                    {/* Type Label */}
                                    {item.type && (
                                        <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                            <Box size={14} className="text-zinc-400" />
                                            {item.type}
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-zinc-400 font-semibold px-2">
                                        <MapPin size={14} />
                                        <span>{item.location}</span>
                                    </div>
                                </div>

                                {/* Modern Progress Insight */}
                                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm">
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none mb-1">Stock Level</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-2xl font-black leading-none tracking-tighter">{item.totalStock}</p>

                                                    {/* Control Buttons */}
                                                    <div className="flex bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-sm">
                                                        <button
                                                            onClick={() => handleAdjustStock(item, -1)}
                                                            disabled={item.totalStock <= 0}
                                                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
                                                            title="Decrease Stock"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
                                                        <button
                                                            onClick={() => handleAdjustStock(item, 1)}
                                                            disabled={!!(item.capacity && item.totalStock >= item.capacity)}
                                                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
                                                            title="Increase Stock"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {item.capacity && item.capacity > 0 && (
                                            <div className="text-right">
                                                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-none mb-1">Capacity</p>
                                                <p className={`text-lg font-black leading-none ${item.totalStock >= item.capacity ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400'}`}>
                                                    {Math.round((item.totalStock / item.capacity) * 100)}%
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {item.capacity && item.capacity > 0 && (
                                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-in-out rounded-full ${item.totalStock >= item.capacity
                                                    ? 'bg-gradient-to-r from-orange-400 to-rose-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                                                    : (item.totalStock / item.capacity) > 0.8
                                                        ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                                                    }`}
                                                style={{ width: `${Math.min((item.totalStock / item.capacity) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                {item.lastUpdated && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-4 font-bold tracking-tight px-1">
                                        <Clock size={12} className="opacity-70" />
                                        <span>LAST SYNC: {new Date(item.lastUpdated).toLocaleTimeString()} — {new Date(item.lastUpdated).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleDelete(item)}
                                className="ml-8 p-4 text-zinc-300 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 rounded-3xl transition-all duration-300 group-hover:opacity-100 md:opacity-0 active:scale-90 shadow-lg hover:shadow-rose-500/20"
                                title="Delete Inventory"
                            >
                                <Trash2 size={24} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
