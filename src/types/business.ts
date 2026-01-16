import { Resource } from "halfred";

export interface BusinessEntity {
    name: string;
    address: string;
    status?: "Open" | "Closed"; // Computed status from backend
    registrationStatus?: "APPLIED" | "ACCEPTED" | "REJECTED"; // Real DB status
    rating?: number;
    hasWifi?: boolean;
    capacity?: number;
    ownerId?: string; // Computed ownerId from backend
    imageUrl?: string;
    openingTime?: string;
    closingTime?: string;
}

export type Business = BusinessEntity & Resource;
