"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { InventoryService } from "@/api/inventoryApi";
import { clientAuthProvider } from "@/lib/authProvider";
import Link from "next/link";

export default function NewInventoryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        totalStock: 0,
    });

    if (!user) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Por favor inicia sesión como BUSINESS.</p>
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
                totalStock: Number(formData.totalStock),
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
            <div className="mb-6">
                <Link
                    href="/inventory"
                    className="text-blue-600 hover:underline"
                >
                    ← Volver a Inventario
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg p-6 shadow">
                <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Artículo</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block font-medium mb-2">Nombre *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border dark:border-zinc-700 rounded dark:bg-zinc-800 dark:text-white"
                            placeholder="Ej: Café Premium Arábica"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium mb-2">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border dark:border-zinc-700 rounded dark:bg-zinc-800 dark:text-white"
                            placeholder="Descripción opcional"
                            rows={3}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block font-medium mb-2">Ubicación *</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border dark:border-zinc-700 rounded dark:bg-zinc-800 dark:text-white"
                            placeholder="Ej: Almacén A, Estante 3"
                        />
                    </div>

                    {/* Total Stock */}
                    <div>
                        <label className="block font-medium mb-2">Stock Total *</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.totalStock}
                            onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                            className="w-full px-3 py-2 border dark:border-zinc-700 rounded dark:bg-zinc-800 dark:text-white"
                            placeholder="0"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50 dark:hover:bg-gray-700"
                        >
                            {loading ? "Creando..." : "Crear Inventario"}
                        </button>
                        <Link
                            href="/inventory"
                            className="flex-1 border dark:border-zinc-700 px-4 py-2 rounded text-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
