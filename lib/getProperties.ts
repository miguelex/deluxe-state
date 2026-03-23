import { supabase } from "./supabase";

export interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    price_suffix: string | null;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image_url: string;
    image_alt: string;
    tags: string[];
    type: "SALE" | "RENT";
    is_featured: boolean;
    created_at: string;
}

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<Property[]> {
    const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true);

    if (error) {
        console.error("Error fetching featured properties:", error.message);
        return [];
    }

    const all = data ?? [];
    // Fisher-Yates shuffle, then pick max 2
    for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all.slice(0, 2);
}


export async function getMarketProperties(
    page: number = 1,
    pageSize: number = PAGE_SIZE
): Promise<PaginatedProperties> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
        .from("properties")
        .select("*", { count: "exact" })
        .eq("is_featured", false)
        .order("created_at", { ascending: true })
        .range(from, to);

    if (error) {
        console.error("Error fetching market properties:", error.message);
        return { properties: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
        properties: data ?? [],
        total,
        page,
        pageSize,
        totalPages,
    };
}
