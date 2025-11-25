import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import { Product } from "@/types/product";

// Objecte dummy per a crides públiques (si no tens autenticació encara)
const publicAuth = { getAuth: async () => null };

export async function getProducts(): Promise<Product[]> {
    
    const resource = await getHal("/products", publicAuth);
    
    const embedded = resource.embeddedArray("products");
    // Protecció extra: si no hi ha productes, embeddedArray pot tornar null
    if (!embedded) return [];
    
    return mergeHalArray<Product>(embedded);
}

export async function getProductById(id: string): Promise<Product> {
    const resource = await getHal(`/products/${id}`, publicAuth);
    return mergeHal<Product>(resource);
}

export async function createProduct(product: Product): Promise<Product> {
    const resource = await postHal('/products', product, publicAuth);
    return mergeHal<Product>(resource);
}