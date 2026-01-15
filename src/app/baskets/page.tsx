import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BasketList from "@/app/components/BasketList";
import { BasketService } from "@/api/basketApi";
import { serverAuthProvider } from "@/lib/authProvider";

export default async function BasketsPage() {
  const basketService = new BasketService(serverAuthProvider);
  const baskets = await basketService.getBaskets();

  const cleanBaskets = baskets.map((basket) => ({
    id: basket.link("self")?.href.split("/").pop() || "#",
    username: basket.customer,
    createdAt: basket.createdAt,
    updatedAt: basket.updatedAt,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Baskets</h1>
          <Button asChild>
            <Link href="/baskets/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Basket
            </Link>
          </Button>
        </div>

        {cleanBaskets.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No baskets found.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check if the Spring Boot backend is running or if there are no baskets created yet.
            </p>
          </div>
        ) : (
          <BasketList initialBaskets={cleanBaskets} />
        )}
      </div>
    </div>
  );
}
