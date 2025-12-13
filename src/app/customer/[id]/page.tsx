import { CustomerService } from "@/api/customerApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CustomerDetailPage({
                                                     params
                                                 }: {
    params: { id: string }
}) {
    const service = new CustomerService(serverAuthProvider);
    const customer = await service.getCustomerById(params.id);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>{customer.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                <p className="text-lg">{customer.phoneNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}