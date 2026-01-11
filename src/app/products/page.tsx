import { ProductService } from "@/api/productApi";
import { UsersService } from "@/api/userApi";
import ProductList from "@/app/components/ProductList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { serverAuthProvider } from "@/lib/authProvider"; 

export default async function ProductsPage() {
    
    const productService = new ProductService(serverAuthProvider);
    const usersService = new UsersService(serverAuthProvider); 

    const [products, currentUser] = await Promise.all([
        productService.getProducts(),
        usersService.getCurrentUser()
    ]);

    const isAdmin = currentUser?.authorities?.some(
        auth => auth.authority === "ROLE_ADMIN"
    );

    // Mapeig de dades (incloent categoryName)
    const cleanProducts = products.map((product) => ({
        id: product.link("self")?.href.split("/").pop() || "#",
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        available: product.available,
        categoryName: product.categoryName || product.category?.name || "General",
    }));

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Our Coffee Products</h1>
                    
                    {isAdmin && (
                        <Button asChild>
                            <Link href="/products/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Product
                            </Link>
                        </Button>
                    )}
                </div>

                {cleanProducts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">
                            No products found. 
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Check if the Spring Boot backend is running or if the database is empty.
                        </p>
                    </div>
                ) : (
                    /* He tret el comentari d'aquí per evitar l'error de sintaxi JSX */
                    <ProductList initialProducts={cleanProducts} />
                )}
            </div>
        </div>
    );
}