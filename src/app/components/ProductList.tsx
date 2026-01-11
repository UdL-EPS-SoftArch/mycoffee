"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/components/searchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faFilter } from "@fortawesome/free-solid-svg-icons";

interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock?: number;
  available?: boolean;
  categoryName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface ProductListProps {
  initialProducts: SimpleProduct[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Obtenim totes les categories úniques dels productes
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      initialProducts.map((p) => p.categoryName).filter(Boolean)
    );
    return Array.from(uniqueCategories).sort();
  }, [initialProducts]);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found{searchTerm && ` matching "${searchTerm}"`}{selectedCategory !== "all" && ` in category "${selectedCategory}"`}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockCount = Number(product.stock || 0);
            const hasStock = stockCount > 0;

            return (
              <Card key={product.id} className="flex flex-col h-full relative group hover:shadow-lg transition-shadow overflow-hidden">
                {/* Product Image - carrega des de l'endpoint /products/{id}/image */}
                <div className="relative w-full h-48 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/products/${product.id}/image`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Si la imatge falla, mostrar placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full absolute inset-0 flex items-center justify-center text-gray-400 dark:text-zinc-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wide">
                            <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                            {product.categoryName}
                        </span>
                        <CardTitle className="text-xl line-clamp-1" title={product.name}>
                            {product.name}
                        </CardTitle>
                    </div>
                    <span className="font-bold text-lg text-blue-600 whitespace-nowrap">
                      {product.price}€
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                    {product.description || "No description available."}
                  </p>
                  <div className="flex gap-2 text-xs font-medium">
                    <span className={hasStock ? "text-green-600" : "text-red-600"}>
                      {hasStock ? `${stockCount} in stock` : "Out of stock"}
                    </span>
                    {product.available && (
                      <span className="text-blue-500">• Available</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}