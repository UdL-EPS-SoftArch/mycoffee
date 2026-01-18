import { Resource } from "halfred";

export interface BasketItemEntity {
    uri?: string;
    id?: number;
    basket: string;      // URI: /baskets/{id}
    product: string;     // URI: /products/{id}
    quantity: number;
}

export type BasketItem = BasketItemEntity & Resource;
