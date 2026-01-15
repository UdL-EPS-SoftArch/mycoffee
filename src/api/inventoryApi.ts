import { getHal, mergeHal, mergeHalArray } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Resource } from "halfred";

export interface InventoryEntity {
    name: string;
    location?: string;
}

export type Inventory = InventoryEntity & Resource;

export class InventoryService {
    constructor(private authProvider: AuthProvider) {}

    async getInventories(): Promise<Inventory[]> {
        // Demanem la llista d'inventaris al backend
        const resource = await getHal("/inventories", this.authProvider);
        const embedded = resource.embeddedArray("inventories");
        
        if (!embedded) return [];
        return mergeHalArray<Inventory>(embedded);
    }
}