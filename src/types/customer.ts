import { Resource } from "halfred";

export interface CustomerEntity {
    uri?: string;
    name: string;
    phoneNumber: string;
}

export type Customer = CustomerEntity & Resource;