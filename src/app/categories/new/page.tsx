"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryService } from "@/api/categoryApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { CategoryEntity } from "@/types/category";

type CategoryFormData = {
    name: string;
    description?: string;
};

export default function NewCategoryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>();

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const categoryData: CategoryEntity = {
                name: data.name,
                description: data.description && data.description.trim() !== "" ? data.description : undefined,
            };

            const categoryService = new CategoryService(clientAuthProvider());
            await categoryService.createCategory(categoryData);

            router.push("/categories");
            router.refresh();
        } catch (err) {
            console.error("Error creating category:", err);
            let message = "Failed to create category.";
            if (err instanceof Error) {
                message = err.message;
            }
            setError(`Error: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
            <div className="max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Category Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name", { required: "Category name is required" })}
                                    placeholder="e.g., Coffee Beans"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Category description..."
                                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    {isSubmitting ? "Creating..." : "Create Category"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
