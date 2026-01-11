import { CustomerService } from "@/api/customerApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CustomerDetailPage(props: { params: Promise<{ id: string }> }) {
    const customerService = new CustomerService(serverAuthProvider);

    let customer;
    try {
        customer = await customerService.getCustomerById((await props.params).id);
    } catch {
        notFound();
    }

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">Customer Details</h1>

                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-lg">{customer.name}</p>
                    </div>

                    <div className="border-b pb-4">
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-lg">{customer.email || 'N/A'}</p>
                    </div>

                    <div className="border-b pb-4">
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="text-lg">{customer.phoneNumber}</p>
                    </div>

                    {customer.uri && (
                        <div className="border-b pb-4">
                            <label className="text-sm font-medium text-gray-500">URI</label>
                            <p className="text-sm text-gray-600 break-all">{customer.uri}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-4">
                    <Link
                        href="/customer"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                        Back to List
                    </Link>
                </div>
            </div>
        </div>
    );
}
