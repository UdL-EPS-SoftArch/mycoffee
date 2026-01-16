import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Category, CategoryEntity } from "@/types/category";

export class CategoryService {
    constructor(private authProvider: AuthProvider) {
    }

    async getCategories(): Promise<Category[]> {
        const resource = await getHal("/categories", this.authProvider);
        const embedded = resource.embeddedArray("categories");
        if (!embedded) return [];
        return mergeHalArray<Category>(embedded);
    }

    async getCategoryById(id: string): Promise<Category> {
        const resource = await getHal(`/categories/${id}`, this.authProvider);
        return mergeHal<Category>(resource);
    }

    async createCategory(category: CategoryEntity): Promise<Category> {
        const resource = await postHal('/categories', category as Category, this.authProvider);
        return mergeHal<Category>(resource);
    }
}
