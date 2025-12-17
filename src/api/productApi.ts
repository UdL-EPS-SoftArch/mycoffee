import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider"; // Assegura't que el tipus existeix
import { Product, ProductEntity } from "@/types/product";

export class ProductService {
    constructor(private authProvider: AuthProvider) {
    }

    async getProducts(): Promise<Product[]> {
        // Crida 'productSummary' projection per obtenir només els camps necessaris
        const resource = await getHal("/products?projection=productSummary", this.authProvider);
        
        const embedded = resource.embeddedArray("products");
        if (!embedded) return [];
        
        return mergeHalArray<Product>(embedded);
    }


    async getProductById(id: string): Promise<Product> {
        const resource = await getHal(`/products/${id}`, this.authProvider);
        return mergeHal<Product>(resource);
    }

    async createProduct(product: ProductEntity): Promise<Product> {
        // Aquí és on fallava abans. Ara utilitzarà les credencials injectades.
        const resource = await postHal('/products', product as Product, this.authProvider);
        return mergeHal<Product>(resource);
    }
}