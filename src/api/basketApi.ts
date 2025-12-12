import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Basket, BasketEntity } from "@/types/basket";

export class BasketService {
    constructor(private authProvider: AuthProvider) {
    }
    async getBaskets(): Promise<Basket[]> {
        const resource = await getHal('/baskets', this.authProvider);
        const embedded = resource.embeddedArray('baskets') || [];
        return mergeHalArray<Basket>(embedded);
    }

    async getBasketById(id: string): Promise<Basket> {
        const resource = await getHal(`/baskets/${id}`, this.authProvider);
        return mergeHal<Basket>(resource);
    }

    async createBasket(basket: BasketEntity): Promise<Basket> {
        const resource = await postHal('/baskets', basket as Basket, this.authProvider);
        return mergeHal<Basket>(resource);
    }
    
}