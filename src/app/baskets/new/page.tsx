"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasketService } from "@/api/basketApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { BasketEntity } from "@/types/basket";
import { useAuth } from "@/app/components/authentication";


export default function NewBasketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth().user;

  const onSubmit = async () => {
    if (!user) {
      setError("You must be logged in to create a basket.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const basketData: BasketEntity = {
        customer: "/customers/" + user.username,
      };

      const basketService = new BasketService(clientAuthProvider());
      const created = await basketService.createBasket(basketData);

      router.push('/baskets');
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words text-sm">
                {error}
              </div>
            )}
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || !user}
              className="w-full mt-4"
            >
              {isSubmitting ? "Creating..." : "Create Basket for current user"}
            </Button>

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
