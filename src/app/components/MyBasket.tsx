"use client";

interface MyBasketProps {
  basketId: string;
}

export default function MyBasket({ basketId }: MyBasketProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">🛒 My Basket (ID: {basketId})</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="font-semibold">Cappuccino</h3>
            <p className="text-sm text-gray-500">$4.00 each</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-200">-</button>
            <span className="w-12 text-center font-semibold">2</span>
            <button className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-200">+</button>
            <button className="ml-4 text-red-500 hover:text-red-700">🗑️ Remove</button>
            <span className="font-bold text-lg ml-4">$8.00</span>
          </div>
        </div>
      </div>
      
      <div className="text-right mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">Total: $12.50</div>
      </div>
      
      <div className="flex gap-4 justify-end">
        <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          Continue Shopping
        </button>
        <button className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
