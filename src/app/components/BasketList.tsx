"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/components/searchBar";

interface SimpleBasket {
  id: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BasketListProps {
  initialBaskets: SimpleBasket[];
}

export default function BasketList({ initialBaskets }: BasketListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBaskets = initialBaskets.filter((basket) =>
    basket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(basket.username).includes(searchTerm)
  );

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {filteredBaskets.length === 0 ? (
        <p className="text-gray-500">
          No baskets found matching &quot;{searchTerm}&quot;.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBaskets.map((basket) => (
            <Card key={basket.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Basket #{basket.id}
                  </CardTitle>
                  <span className="text-sm text-gray-500">
                    Customer {basket.username}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow text-sm text-gray-600 space-y-1">
                {basket.createdAt && (
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {basket.createdAt}
                  </p>
                )}
                {basket.updatedAt && (
                  <p>
                    <span className="font-medium">Updated:</span>{" "}
                    {basket.updatedAt}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/baskets/${basket.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
