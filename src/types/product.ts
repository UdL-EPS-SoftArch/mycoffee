import { Resource } from "halfred";

// Aquesta interfície representa les dades "crues" (properties) del recurs
export interface ProductEntity {
    // Identificador
    id?: number; // Tot i que sol venir als _links, a vegades s'exposa.

    // Camps bàsics
    name: string;
    description?: string;
    brand?: string;
    size?: string;
    barcode?: string;
    
    // Camps econòmics i d'estoc
    // BigDecimal i int a Java es converteixen a number a JS
    price: number;
    stock: number; // A Java és int primitiu (no null), per tant obligatori
    tax?: number;

    // Camps lògics (Noteu l'ús de @JsonProperty a Java)
    available: boolean; // Java: isAvailable -> JSON: "available"
    
    // Camps promocionals
    promotions?: string;
    discount?: string;

    // Informació Nutricional (Faltaven tots aquests)
    kcal?: number;
    carbs?: number;
    proteins?: number;
    fats?: number;

    // Col·leccions (Set<String> passa a string[])
    ingredients?: string[];
    allergens?: string[];

    // Valoració
    rating?: number;

    // Programa de fidelització
    pointsGiven?: number;
    pointsCost?: number;
    partOfLoyaltyProgram: boolean; // Java: isPartOfLoyaltyProgram -> JSON: "partOfLoyaltyProgram"
}

// El tipus final que utilitzaràs als components, que inclou els mètodes de navegació de Halfred
export type Product = ProductEntity & Resource;