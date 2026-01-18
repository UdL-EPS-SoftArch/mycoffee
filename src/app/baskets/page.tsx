import { BasketService } from "@/api/basketApi";
import { serverAuthProvider } from "@/lib/authProvider";
import MyBasket from "@/app/components/MyBasket";

export default async function MyBasketPage() {
  const mockUser = { username: "demo-user" }; 
  
  const basketService = new BasketService(serverAuthProvider);
  const baskets = await basketService.getBaskets();
  
  const myBasket = baskets.find(b => 
    b.customer?.includes(mockUser.username)
  );
  
  if (!myBasket) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Basket is Empty</h1>
        <a href="/products" className="text-blue-600 hover:underline">
          Continue Shopping →
        </a>
      </div>
    );
  }
  
  return <MyBasket basketId={String(myBasket.id)} />;

}

