"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasketService } from "@/api/basketApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { BasketEntity } from "@/types/basket";

type BasketFormData = {
  customerId: number;
};

export default function NewBasketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasketFormData>();

  const onSubmit = async (data: BasketFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const basketData: BasketEntity = {
        customerId: Number(data.customerId),
      };

      const basketService = new BasketService(clientAuthProvider());
      const created = await basketService.createBasket(basketData);

      router.push(`/baskets/${created.id}`);
      router.refresh();
    } catch (err) {
      console.error("Error creating basket:", err);
      let message = "Failed to create basket.";
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
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Create New Basket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customerId">
                  Customer ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerId"
                  type="number"
                  {...register("customerId", {
                    required: "Customer ID is required",
                    min: { value: 1, message: "Customer ID must be positive" },
                  })}
                  placeholder="1"
                />
                {errors.customerId && (
                  <p className="text-sm text-red-500">
                    {errors.customerId.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Basket"}
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
