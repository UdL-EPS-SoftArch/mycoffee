import { Resource } from "halfred";

export interface Inventory extends Resource {
    id: number;
    name: string;
    description?: string;
    location: string;
    totalStock: number;
    capacity?: number;
    type?: 'WAREHOUSE' | 'SHELF' | 'FRIDGE' | 'DISPLAY' | 'BACKROOM';
    status?: 'ACTIVE' | 'FULL' | 'MAINTENANCE' | 'CLOSED';
    lastUpdated?: string;
}
