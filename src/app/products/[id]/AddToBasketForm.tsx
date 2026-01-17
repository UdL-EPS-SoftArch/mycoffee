"use client";

import { Button } from "@/components/ui/button";
import { BasketService } from "@/api/basketApi";
import { BasketItemService } from "@/api/basketItemApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/authentication";

interface AddToBasketFormProps {
    productId: string;
    productName: string;
    isAvailable: boolean;
    }

    export default function AddToBasketForm({ 
    productId, 
    productName, 
    isAvailable 
    }: AddToBasketFormProps) {
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
        alert("Please login first");
        router.push("/login");
        return;
        }

        try {
        const basketService = new BasketService(clientAuthProvider());
        const basketItemService = new BasketItemService(clientAuthProvider());
        
        // Get or create basket
        let userBasket;
        try {
            const baskets = await basketService.getBaskets();
            const basketsArray = Array.isArray(baskets) ? baskets : [baskets];
            userBasket = basketsArray.find(b => 
            b.customer?.includes(user.username)
            ) || basketsArray[0];
        } catch (error) {
            console.log("No basket, creating");
        }

        if (!userBasket || !userBasket.id) {
            userBasket = await basketService.createBasket({
            customer: `/customers/${user.username}`,
            });
        }

        // Add item
        await basketItemService.addItem({
            basket: `/baskets/${userBasket.id}`,
            product: `/products/${productId}`,
            quantity: 1,
        });

        console.log(`Added ${productName} to basket`);
        router.push("/baskets");
        } catch (error) {
        console.error("Error:", error);
        alert("Failed to add to basket");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <Button
            type="submit"
            className="w-full font-bold text-lg h-12 shadow-blue-200 dark:shadow-none"
            size="lg"
            disabled={!isAvailable}
        >
            Add to Basket
        </Button>
        </form>
    );
}
