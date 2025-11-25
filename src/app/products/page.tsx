import Link from "next/link";
import { getProducts } from "@/api/productApi";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Our Coffee Products</h1>

                {products.length === 0 ? (
                    <p className="text-gray-500">No products found. Check if the backend is running.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Card key={product.name} className="flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{product.name}</CardTitle>
                                        <span className="font-bold text-lg text-blue-600">
                                            {product.price}€
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                                        {product.description || "No description available."}
                                    </p>
                                    <div className="flex gap-2 text-xs font-medium">
                                        <span className={product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {product.stock && product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                        </span>
                                        {product.available && <span className="text-blue-500">• Available</span>}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/products/${product.link('self')?.href.split('/').pop()}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}