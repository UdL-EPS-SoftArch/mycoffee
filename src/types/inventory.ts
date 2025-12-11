import { Resource } from "halfred";

export interface Inventory extends Resource {
    id: number;
    name: string;
    description?: string;
    location: string;
    totalStock: number;
}
