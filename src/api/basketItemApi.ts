import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { BasketItem, BasketItemEntity } from "@/types/basketItem";

export class BasketItemService {
    constructor(private authProvider: AuthProvider) {}

    async getItemsByBasket(basketId: string): Promise<BasketItem[]> {
        const resource = await getHal(`/baskets/${basketId}/items`, this.authProvider);
        const embedded = resource.embeddedArray('basketItems') || [];
        return mergeHalArray<BasketItem>(embedded);
    }

    async addItem(item: BasketItemEntity): Promise<BasketItem> {
        const resource = await postHal('/basketItems', item as BasketItem, this.authProvider);
        return mergeHal<BasketItem>(resource);
    }

    async updateQuantity(itemId: string, quantity: number): Promise<BasketItem> {
        const resource = await getHal(`/basketItems/${itemId}`, this.authProvider);
        const item = mergeHal<BasketItem>(resource);
        item.quantity = quantity;
        
        const updated = await postHal(`/basketItems/${itemId}`, item, this.authProvider);
        return mergeHal<BasketItem>(updated);
    }
}
