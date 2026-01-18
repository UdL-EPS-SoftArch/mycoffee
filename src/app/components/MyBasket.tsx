"use client";

import { useEffect, useState } from "react";
import { BasketItemService } from "@/api/basketItemApi";
import { ProductService } from "@/api/productApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Button } from "@/components/ui/button";

interface MyBasketProps {
  basketId: string;
}

interface BasketItemDisplay {
  id: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export default function MyBasket({ basketId }: MyBasketProps) {
  const [items, setItems] = useState<BasketItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const basketItemService = new BasketItemService(clientAuthProvider());
        const productService = new ProductService(clientAuthProvider());
        const rawItems = await basketItemService.getItemsByBasket(basketId);
        
        const displayItems = await Promise.all(rawItems.map(async (item: any) => {
          let productName = "Unknown Product";
          let productPrice = 0;

          try {
            // item.product usually contains the URI from HAL
            const productUri = item._links?.product?.href;
            if (productUri) {
              const productId = productUri.split("/").pop();
              const product = await productService.getProductById(productId);
              productName = product.name;
              productPrice = product.price;
            }
          } catch (e) {
            console.error("Error fetching product details", e);
          }

          return {
            id: item.id || Math.random(),
            productName,
            productPrice,
            quantity: item.quantity || 1,
          };
        }));
        
        setItems(displayItems);
      } catch (error) {
        console.error("Error fetching basket items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [basketId]);

  const total = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  if (loading) return <div className="text-center py-12">Loading your basket...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">🛒 My Basket</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your basket is empty</p>
          <a href="/products" className="text-blue-600 hover:underline">
            Continue Shopping →
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-500">${item.productPrice.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">x{item.quantity}</span>
                  <span className="font-bold">${(item.productPrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-right mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              Total: ${total.toFixed(2)}
            </div>
          </div>
          
          <div className="flex gap-4 justify-end">
            <Button variant="outline" asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
            <Button size="lg">Proceed to Checkout →</Button>
          </div>
        </>
      )}
    </div>
  );
}
