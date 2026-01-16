import Link from "next/link";
import { BasketService } from "@/api/basketApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BasketDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const basketService = new BasketService({
    getAuth: async () => null,
  });

  const basket = await basketService.getBasketById(params.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">

        <div className="mb-4">
          <Link
            href="/baskets"
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Back to baskets
          </Link>
        </div>

        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl">
              Basket #{basket.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-semibold">Customer ID: </span>
              <span>{basket.customer}</span>
            </div>
            {basket.createdAt && (
              <div>
                <span className="font-semibold">Created at: </span>
                <span>{basket.createdAt}</span>
              </div>
            )}
            {basket.updatedAt && (
              <div>
                <span className="font-semibold">Updated at: </span>
                <span>{basket.updatedAt}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/baskets">
              Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
