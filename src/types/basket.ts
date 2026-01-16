import { Resource } from "halfred";
import { UserEntity } from "./user";

export interface BasketEntity {
    uri?: string;
    id?: number;            // Long en backend → number en TS
    customer: string;
    createdAt?: string;     // ZonedDateTime → string ISO
    updatedAt?: string;
}

export type Basket = BasketEntity & Resource;
