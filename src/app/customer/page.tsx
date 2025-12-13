import Link from "next/link";
import { CustomerService } from "@/api/customerApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { Button } from "@/components/ui/button";

export default async function CustomersPage() {
    const service = new CustomerService(serverAuthProvider);
    const customers = await service.getCustomers();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-2xl font-semibold">Customers</h1>
                        <Link href="/customer/register">
                            <Button>Add Customer</Button>
                        </Link>
                    </div>

                    <ul className="space-y-3 w-full">
                        {customers.map((customer, i) => (
                            <li
                                key={i}
                                className="p-4 w-full border rounded-lg bg-white shadow-sm hover:shadow transition dark:bg-black"
                            >
                                <Link
                                    className="font-medium text-lg"
                                    href={`/customer/${customer.uri?.split('/').pop()}`}
                                >
                                    {customer.name}
                                </Link>

                                <div className="text-gray-500 text-sm mt-1">
                                    {customer.phoneNumber}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}