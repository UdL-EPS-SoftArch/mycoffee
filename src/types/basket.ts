import { Resource } from "halfred";

export interface BasketEntity {
    uri?: string;
    id?: number;            // Long en backend → number en TS
    customerId: number; 
    createdAt?: string;     // ZonedDateTime → string ISO
    updatedAt?: string;
}

export type Basket = BasketEntity & Resource;