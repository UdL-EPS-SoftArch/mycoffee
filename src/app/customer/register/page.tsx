"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { CustomerService } from "@/api/customerApi";
import { clientAuthProvider } from "@/lib/authProvider";

type FormValues = {
    name: string;
    phoneNumber: string;
};

export default function CustomerRegistrationPage() {
    const service = new CustomerService(clientAuthProvider());
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const newCustomer = await service.createCustomer(data as Customer);
            const customerId = newCustomer.uri?.split('/').pop();
            router.push(`/customer/${customerId}`);
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>New Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        {...register("name", {
                                            required: "Name is required"
                                        })}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        {...register("phoneNumber", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{9}$/,
                                                message: "Must be 9 digits",
                                            },
                                        })}
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" className="mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Customer"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}