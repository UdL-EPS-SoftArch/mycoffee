import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Business, BusinessEntity } from "@/types/business";

export class BusinessService {
    constructor(private authProvider: AuthProvider) {
    }

    async getBusinesses(): Promise<Business[]> {
        const resource = await getHal("/businesses", this.authProvider);

        const embedded = resource.embeddedArray("businesses");
        if (!embedded) return [];

        return mergeHalArray<Business>(embedded);
    }

    async getBusinessById(id: string): Promise<Business> {
        const resource = await getHal(`/businesses/${id}`, this.authProvider);
        return mergeHal<Business>(resource);
    }

    async createBusiness(business: BusinessEntity): Promise<Business> {
        const resource = await postHal('/businesses', business as Business, this.authProvider);
        return mergeHal<Business>(resource);
    }
}
