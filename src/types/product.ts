import { Resource } from "halfred";

export interface ProductEntity {
    name: string;
    price: number;
    description?: string;
    stock?: number;
    brand?: string;
    size?: string;
    barcode?: string;

    // Estados
    available?: boolean;
    partOfLoyaltyProgram?: boolean;

    // Valoración y Fidelidad
    rating?: number;
    pointsGiven?: number;
    pointsCost?: number;

    // Información Nutricional y Composición
    kcal?: number;
    carbs?: number;
    proteins?: number;
    fats?: number;
    ingredients?: string[];
    allergens?: string[];
}

export type Product = ProductEntity & Resource;