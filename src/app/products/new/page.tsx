"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductService } from "@/api/productApi";
import { CategoryService } from "@/api/categoryApi";
import { InventoryService } from "@/api/inventoryApi"; // <--- IMPORT NOU
import { clientAuthProvider } from "@/lib/authProvider";
import { ProductEntity } from "@/types/product";
import { Category } from "@/types/category";
import { Inventory } from "@/api/inventoryApi"; // <--- IMPORT NOU

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8080";

type ProductFormData = {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  brand?: string;
  size?: string;
  barcode?: string;
  
  category?: string;
  inventory: string; // <--- NOU CAMP OBLIGATORI

  available?: boolean;
  partOfLoyaltyProgram?: boolean;

  rating?: number;
  pointsGiven?: number;
  pointsCost?: number;

  kcal?: number;
  carbs?: number;
  proteins?: number;
  fats?: number;

  ingredients?: string;
  allergens?: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estats per les llistes desplegables
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [inventories, setInventories] = useState<{ id: string; name: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      available: true,
      stock: 0,
    },
  });

  // Carregar Dades (Categories i Inventaris)
  useEffect(() => {
    const loadData = async () => {
      try {
        const auth = clientAuthProvider();
        const categoryService = new CategoryService(auth);
        const inventoryService = new InventoryService(auth); // <--- Servei nou

        // Fem les dues peticions en paral·lel
        const [fetchedCategories, fetchedInventories] = await Promise.all([
            categoryService.getCategories(),
            inventoryService.getInventories()
        ]);

        // Processar categories
        const categoryList = fetchedCategories.map((cat: Category) => ({
          id: cat.link("self")?.href.split("/").pop() || "",
          name: cat.name,
        }));
        setCategories(categoryList);

        // Processar inventaris
        const inventoryList = fetchedInventories.map((inv: Inventory) => ({
            id: inv.link("self")?.href.split("/").pop() || "",
            name: inv.name,
        }));
        setInventories(inventoryList);

      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const productData: ProductEntity = {
        name: data.name,
        price: Number(data.price),
        description: data.description && data.description.trim() !== "" ? data.description : undefined,
        stock: data.stock ? Number(data.stock) : 0,
        available: data.available ?? true,
        brand: data.brand && data.brand.trim() !== "" ? data.brand : undefined,
        size: data.size && data.size.trim() !== "" ? data.size : undefined,
        barcode: data.barcode && data.barcode.trim().length > 0 ? data.barcode : undefined,
        partOfLoyaltyProgram: data.partOfLoyaltyProgram ?? false,
        rating: data.rating ? Number(data.rating) : undefined,
        pointsGiven: data.pointsGiven ? Number(data.pointsGiven) : undefined,
        pointsCost: data.pointsCost ? Number(data.pointsCost) : undefined,
        kcal: data.kcal ? Number(data.kcal) : undefined,
        carbs: data.carbs ? Number(data.carbs) : undefined,
        proteins: data.proteins ? Number(data.proteins) : undefined,
        fats: data.fats ? Number(data.fats) : undefined,
        ingredients: data.ingredients && data.ingredients.trim().length > 0
          ? data.ingredients.split(",").map((i) => i.trim()).filter(i => i.length > 0)
          : [],
        allergens: data.allergens && data.allergens.trim().length > 0
          ? data.allergens.split(",").map((a) => a.trim()).filter(a => a.length > 0)
          : [],
      };

      // --- CONSTRUCCIÓ DEL PAYLOAD AMB ENLLAÇOS ---
      const productPayload = {
        ...productData,
        
        // Enllaç a Categoria (URL Absoluta)
        ...(data.category && data.category !== "" 
            ? { category: `${API_BASE_URL}/categories/${data.category}` } 
            : {}),

        // Enllaç a Inventari (URL Absoluta) - OBLIGATORI
        inventory: `${API_BASE_URL}/inventories/${data.inventory}`
      };

      console.log("Payload enviat:", JSON.stringify(productPayload, null, 2));

      const productService = new ProductService(clientAuthProvider());
      await productService.createProduct(productPayload as ProductEntity);
      
      router.push("/products");
      router.refresh();
    } catch (err) {
      console.error("Error creating product:", err);
      let message = "Failed to create product.";
      if (err instanceof Error) message = err.message;
      setError(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words text-sm">
                  {error}
                </div>
              )}

              {/* === INVENTORY SELECTOR (NOU) === */}
              <div className="space-y-2">
                <Label htmlFor="inventory">Select Inventory <span className="text-red-500">*</span></Label>
                <select
                  id="inventory"
                  {...register("inventory", { required: "Inventory is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingData}
                >
                  <option value="">-- Select Inventory --</option>
                  {inventories.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name}
                    </option>
                  ))}
                </select>
                {errors.inventory && (
                  <p className="text-sm text-red-500">{errors.inventory.message}</p>
                )}
                {inventories.length === 0 && !loadingData && (
                    <p className="text-xs text-yellow-600">Warning: No inventories found. The backend loader should have created one.</p>
                )}
              </div>

              {/* NAME */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  {...register("name", { required: "Product name is required" })}
                  placeholder="e.g., Espresso Roast"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* PRICE */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (€) <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: "Price is required", min: 0 })}
                  placeholder="9.99"
                />
              </div>

              {/* CATEGORY */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingData}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* STOCK */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" {...register("stock", { min: 0 })} placeholder="0" />
              </div>

              {/* AVAILABLE */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="available" {...register("available")} className="h-4 w-4" />
                <Label htmlFor="available">Available for purchase</Label>
              </div>

              {/* BRAND, SIZE, BARCODE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" {...register("brand")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input id="size" {...register("size")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input id="barcode" {...register("barcode", { pattern: { value: /^\d{13}$/, message: "13 digits" }})} />
                  </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md dark:bg-zinc-900"
                />
              </div>

              {/* RATING & LOYALTY */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input id="rating" type="number" step="0.1" max={5} {...register("rating")} />
                  </div>
                  <div className="flex items-center space-x-2 mt-8">
                    <input type="checkbox" id="partOfLoyaltyProgram" {...register("partOfLoyaltyProgram")} className="h-4 w-4" />
                    <Label htmlFor="partOfLoyaltyProgram">Loyalty Program</Label>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="pointsGiven">Points Given</Label><Input type="number" {...register("pointsGiven")} /></div>
                <div><Label htmlFor="pointsCost">Points Cost</Label><Input type="number" {...register("pointsCost")} /></div>
              </div>

              {/* NUTRITION */}
              <div className="grid grid-cols-4 gap-2">
                <div><Label>Kcal</Label><Input type="number" {...register("kcal")} /></div>
                <div><Label>Carbs</Label><Input type="number" {...register("carbs")} /></div>
                <div><Label>Prot</Label><Input type="number" {...register("proteins")} /></div>
                <div><Label>Fats</Label><Input type="number" {...register("fats")} /></div>
              </div>

              <div className="space-y-2">
                <Label>Ingredients</Label>
                <Input {...register("ingredients")} placeholder="comma separated" />
              </div>
              <div className="space-y-2">
                <Label>Allergens</Label>
                <Input {...register("allergens")} placeholder="comma separated" />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}