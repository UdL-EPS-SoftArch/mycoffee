"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientAuthProvider } from "@/lib/authProvider";
import { CustomerService } from "@/api/customerApi";
import { Customer } from "@/types/customer";

export default function CustomerDashboard() {
    const router = useRouter();
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const loadCurrentCustomer = async () => {
            try {
                const authProvider = clientAuthProvider();
                const service = new CustomerService(authProvider);

                // Intentar cargar el perfil del usuario actual
                // (usando /identity o similar del backend)
                const identityResponse = await fetch("http://localhost:8080/identity", {
                    headers: {
                        "Accept": "application/hal+json",
                        ...(await authProvider.getAuth() ? {
                            "Authorization": `Basic ${btoa((await authProvider.getAuth()) || '')}`
                        } : {})
                    }
                });

                if (identityResponse.ok) {
                    // Si /identity funciona, cargar datos del customer actual
                    const customerData = await service.getCustomerById(
                        (await authProvider.getAuth())?.split(':')[0] || ''
                    );
                    setCurrentCustomer(customerData);
                }
            } catch (error) {
                console.error("Error loading customer profile:", error);
                // Si no está autenticado, redirigir al login
                router.push("/customer/login");
            } finally {
                setLoading(false);
            }
        };

        loadCurrentCustomer();
    }, [mounted, router]);

    if (!mounted) return null;
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 shadow-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-4">
                        Bienvenido a MyCoffee ☕
                    </h1>
                    {currentCustomer && (
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Hola, <span className="font-semibold">{currentCustomer.name}</span>
                        </p>
                    )}
                </div>

                {/* Opciones principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Mi Perfil */}
                    <Link href="/customer/id" className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-blue-200 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Mi Perfil
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Gestiona tu información personal, dirección y preferencias
                            </p>
                            <svg className="w-6 h-6 text-blue-500 mx-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Productos */}
                    <Link href="/products/page" className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-green-200 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl mx-auto mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                Productos
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Explora cafés, dulces y bebidas disponibles en tu zona
                            </p>
                            <svg className="w-6 h-6 text-green-500 mx-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Negocios */}
                    <Link href="/business/page" className="group">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-purple-200 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl mx-auto mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m1 9h1" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                Negocios
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Descubre cafeterías y tiendas cercanas con ofertas especiales
                            </p>
                            <svg className="w-6 h-6 text-purple-500 mx-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Acciones secundarias */}
                <div className="mt-16 text-center">
                    <div className="inline-flex gap-4">
                        <Link
                            href="/customer/login"
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-all font-medium"
                        >
                            Cambiar Usuario
                        </Link>
                        <Link
                            href="/customer/register"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            Invitar Amigo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
