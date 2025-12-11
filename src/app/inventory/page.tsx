"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/authentication";
import { InventoryService } from "@/api/inventoryApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Inventory } from "@/types/inventory";
import Link from "next/link";

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
        if (!window.confirm("¿Eliminar este inventario?")) return;

        try {
            const service = new InventoryService(clientAuthProvider());
            await service.deleteInventory(inventory);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Error deleting inventory", err);
            alert("Error al eliminar: " + (err as Error).message);
        }
    };

    if (!user) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Por favor inicia sesión como BUSINESS para ver inventarios.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mi Inventario</h1>
                <Link
                    href="/inventory/new"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-700"
                >
                    + Agregar Artículo
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div className="p-10 text-center text-gray-500">Cargando inventarios...</div>
            ) : inventories.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    <p>No tienes artículos en el inventario.</p>
                    <Link href="/inventory/new" className="text-blue-600 hover:underline mt-2 inline-block">
                        Crea uno ahora →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {inventories.map((item) => (
                        <div
                            key={item.id}
                            className="border p-4 rounded shadow-sm bg-white dark:bg-zinc-900 flex justify-between items-start hover:shadow-md transition"
                        >
                            <div className="flex-1">
                                <h2 className="font-semibold text-lg">{item.name}</h2>
                                {item.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {item.description}
                                    </p>
                                )}
                                <div className="mt-3 flex gap-4 text-sm">
                                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                                        📦 Stock: {item.totalStock}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        📍 {item.location}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(item)}
                                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm whitespace-nowrap"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
