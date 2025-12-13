"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customer";
import { CustomerService } from "@/api/customerApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useAuth } from "@/app/components/authentication";

export default function CustomerPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const loadCustomers = async () => {
            try {
                const authProvider = clientAuthProvider();
                const service = new CustomerService(authProvider);
                const data = await service.getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Error loading customers:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, [mounted]);

    if (!mounted) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Customers
                    </h1>
                    <button
                        onClick={() => router.push("/customer/register")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Register New Customer
                    </button>
                </div>

                {customers.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            No customers found. Register your first customer!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {customers.map((customer) => {
                            const customerId = customer.uri?.split('/').pop() || '';
                            return (
                                <div
                                    key={customer.uri}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
                                    onClick={() => router.push(`/customer/${customerId}`)}
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {customer.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {customer.phoneNumber}
                                    </p>
                                    {customer.email && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                            {customer.email}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}