import { getHal, mergeHal, mergeHalArray, postHal } from "@/lib/halClient"; 
import type { AuthProvider } from "@/lib/authProvider";
import { Inventory } from "@/types/inventory";
import { User } from "@/types/user";

export class InventoryService {
    constructor(private authProvider: AuthProvider) {
    }

    async getAllInventories(): Promise<Inventory[]> {
        const resource = await getHal('/inventories', this.authProvider);
        const embedded = resource.embeddedArray('inventories') || [];
        return mergeHalArray<Inventory>(embedded);
    }

   
    async getMyInventories(user: User): Promise<Inventory[]> {
        
        const userUri = user.uri || user._links?.self?.href; 
        
        if (!userUri) throw new Error("User URI not found");

        const resource = await getHal(
            `/inventories/search/findByBusiness?business=${userUri}`, 
            this.authProvider
        );
        const embedded = resource.embeddedArray('inventories') || [];
        return mergeHalArray<Inventory>(embedded);
    }

   
    async createInventory(inventory: Partial<Inventory>): Promise<Inventory> {
        const resource = await postHal('/inventories', inventory as any, this.authProvider);
        return mergeHal<Inventory>(resource);
    }
    
    async deleteInventory(inventory: Inventory): Promise<void> {
        const auth = await this.authProvider.getAuth();
        const url = inventory._links?.self?.href;
        if (!url) return;
        
        await fetch(url, {
            method: 'DELETE',
            headers: auth ? { Authorization: auth } : {}
        });
    }
}
