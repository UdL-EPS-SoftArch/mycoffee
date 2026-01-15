import { Resource } from "halfred";
import { UserEntity } from "./user";

export interface BusinessEntity extends UserEntity {
    name: string;
    address: string;
    status?: "Open" | "Closed";
    registrationStatus?: "APPLIED" | "ACCEPTED" | "REJECTED";
    rating?: number;
    hasWifi?: boolean;
    capacity?: number;
    ownerId?: string;
    imageUrl?: string;
    openingTime?: string;
    closingTime?: string;
}

export type Business = BusinessEntity & Resource;
