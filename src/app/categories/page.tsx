import { CategoryService } from "@/api/categoryApi";
import { UsersService } from "@/api/userApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { serverAuthProvider } from "@/lib/authProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

export default async function CategoriesPage() {
    const categoryService = new CategoryService(serverAuthProvider);
    const usersService = new UsersService(serverAuthProvider);

    const [categories, currentUser] = await Promise.all([
        categoryService.getCategories(),
        usersService.getCurrentUser()
    ]);

    const isAdmin = currentUser?.authorities?.some(
        auth => auth.authority === "ROLE_ADMIN"
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Product Categories</h1>

                    {isAdmin && (
                        <Button asChild>
                            <Link href="/categories/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Category
                            </Link>
                        </Button>
                    )}
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">
                            No categories found.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Check if the Spring Boot backend is running or create a new category.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category) => {
                            const id = category.link("self")?.href.split("/").pop() || "#";
                            return (
                                <Card key={id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faTag} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <CardTitle className="text-xl">{category.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {category.description || "No description available."}
                                        </p>
                                        <div className="mt-4">
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                                                    View Products
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
