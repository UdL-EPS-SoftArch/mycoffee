'use client';

import { useEffect, useState } from 'react';
import { Customer } from '@/types/customer';
import { CustomerService } from '@/api/customerApi';
import { clientAuthProvider } from '@/lib/authProvider';
import { useParams, useRouter } from 'next/navigation';

export default function CustomerDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const authProvider = clientAuthProvider();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const service = new CustomerService(authProvider);

        service.getCustomerById(id as string)
            .then((c) => setCustomer(c))
            .catch((err) => {
                console.error(err);
                setError('Customer not found');
            })
            .finally(() => setLoading(false));
    }, [id, authProvider]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!customer) return null;

    return (
        <div className="p-6">
            <button
                className="px-3 py-1 bg-gray-300 rounded mb-4"
                onClick={() => router.back()}
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
            <p className="text-lg"> {customer.phoneNumber}</p>

            <div className="mt-4 text-sm text-gray-500">
                <strong>URI:</strong> {customer.uri}
            </div>
        </div>
    );
}
