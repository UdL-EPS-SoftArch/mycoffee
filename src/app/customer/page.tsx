'use client';

import { useState } from 'react';
import { CustomerService } from '@/api/customerApi';
import { clientAuthProvider } from '@/lib/authProvider';
import { useRouter } from 'next/navigation';

export default function RegisterCustomerPage() {
    const router = useRouter();
    const authProvider = clientAuthProvider();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const service = new CustomerService(authProvider);

        try {
            await service.createCustomer({ name, phoneNumber });
            router.push('/customer');
        } catch (err) {
            console.error(err);
            setError('Error creating customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register Customer</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        className="border p-2 w-full rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Phone Number</label>
                    <input
                        className="border p-2 w-full rounded"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Create Customer'}
                </button>
            </form>
        </div>
    );
}
