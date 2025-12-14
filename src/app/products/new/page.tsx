"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductService } from "@/api/productApi"; 
import { clientAuthProvider } from "@/lib/authProvider";
import { ProductEntity } from "@/types/product";

type ProductFormData = {
  name: string;
  price: number;
  description?: string;
  stock?: number;
  brand?: string;
  size?: string;
  barcode?: string;

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

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // CONSTRUCCIÓ I NETEJA DE DADES
      // L'objectiu és convertir cadenes buides "" a undefined perquè el backend rebi null.
      const productData: ProductEntity = {
        name: data.name,
        price: Number(data.price),
        
        // Si la descripció és buida, enviem undefined
        description: data.description && data.description.trim() !== "" ? data.description : undefined,
        
        stock: data.stock ? Number(data.stock) : 0,
        available: data.available ?? true,

        brand: data.brand && data.brand.trim() !== "" ? data.brand : undefined,
        size: data.size && data.size.trim() !== "" ? data.size : undefined,
        
        // --- CORRECCIÓ CRÍTICA DEL BARCODE ---
        // Si el barcode és una string buida "", enviem undefined.
        // Així evitem l'error del @Pattern de Java.
        barcode: data.barcode && data.barcode.trim().length > 0 ? data.barcode : undefined,

        partOfLoyaltyProgram: data.partOfLoyaltyProgram ?? false,
        
        // Convertim a Number només si existeix valor
        rating: data.rating ? Number(data.rating) : undefined,
        pointsGiven: data.pointsGiven ? Number(data.pointsGiven) : undefined,
        pointsCost: data.pointsCost ? Number(data.pointsCost) : undefined,

        kcal: data.kcal ? Number(data.kcal) : undefined,
        carbs: data.carbs ? Number(data.carbs) : undefined,
        proteins: data.proteins ? Number(data.proteins) : undefined,
        fats: data.fats ? Number(data.fats) : undefined,

        // Arrays: Evitem crear arrays amb strings buides [""]
        ingredients: data.ingredients && data.ingredients.trim().length > 0
          ? data.ingredients.split(",").map((i) => i.trim()).filter(i => i.length > 0)
          : [],

        allergens: data.allergens && data.allergens.trim().length > 0
          ? data.allergens.split(",").map((a) => a.trim()).filter(a => a.length > 0)
          : [],
      };

      console.log("Enviant dades al backend:", JSON.stringify(productData, null, 2));

      const productService = new ProductService(clientAuthProvider());
      await productService.createProduct(productData);
      
      router.push("/products");
      router.refresh();
    } catch (err) {
      console.error("Error creating product:", err);
      // Comprovem si l'error és una instància de Error per accedir al missatge de forma segura
      let message = "Failed to create product.";
      if (err instanceof Error) {
        message = err.message;
      }
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
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words text-sm">
                  {error}
                </div>
              )}

              {/* NAME */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Product name is required" })}
                  placeholder="e.g., Espresso Roast"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* PRICE */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (€) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  placeholder="9.99"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Product description..."
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* STOCK */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", {
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock.message}</p>
                )}
              </div>

              {/* AVAILABLE */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  {...register("available")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="available" className="cursor-pointer">
                  Available for purchase
                </Label>
              </div>

              {/* BRAND */}
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...register("brand")} placeholder="Lavazza, Nespresso..." />
              </div>

              {/* SIZE */}
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input id="size" {...register("size")} placeholder="250g, 1kg..." />
              </div>

              {/* BARCODE */}
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode (EAN-13)</Label>
                <Input 
                    id="barcode" 
                    {...register("barcode", {
                        // Opcional: Validació al front per avisar l'usuari abans
                        pattern: {
                            value: /^\d{13}$/,
                            message: "Barcode must be exactly 13 digits"
                        }
                    })} 
                    placeholder="1234567890123" 
                />
                <p className="text-xs text-gray-500">Leave empty if not applicable.</p>
                {errors.barcode && (
                  <p className="text-sm text-red-500">{errors.barcode.message}</p>
                )}
              </div>

              {/* LOYALTY */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="partOfLoyaltyProgram" {...register("partOfLoyaltyProgram")} />
                <Label htmlFor="partOfLoyaltyProgram" className="cursor-pointer">
                  Part of loyalty program
                </Label>
              </div>

              {/* RATING */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0–5)</Label>
                <Input id="rating" type="number" step="0.1" min={0} max={5} {...register("rating")} />
              </div>

              {/* POINTS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pointsGiven">Points Given</Label>
                  <Input id="pointsGiven" type="number" {...register("pointsGiven")} />
                </div>
                <div>
                  <Label htmlFor="pointsCost">Points Cost</Label>
                  <Input id="pointsCost" type="number" {...register("pointsCost")} />
                </div>
              </div>

              {/* NUTRITION */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kcal">kcal</Label>
                  <Input id="kcal" type="number" {...register("kcal")} />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" type="number" {...register("carbs")} />
                </div>
                <div>
                  <Label htmlFor="proteins">Proteins (g)</Label>
                  <Input id="proteins" type="number" {...register("proteins")} />
                </div>
                <div>
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input id="fats" type="number" {...register("fats")} />
                </div>
              </div>

              {/* INGREDIENTS */}
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Input
                  id="ingredients"
                  {...register("ingredients")}
                  placeholder="coffee, sugar, milk..."
                />
              </div>

              {/* ALLERGENS */}
              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens (comma separated)</Label>
                <Input id="allergens" {...register("allergens")} placeholder="milk, gluten..." />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
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