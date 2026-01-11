import { Resource } from "halfred";

export interface CategoryEntity {
    name: string;
    description?: string;
}

export type Category = CategoryEntity & Resource;
