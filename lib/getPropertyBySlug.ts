import { supabase } from "./supabase";
import { Property } from "./getProperties";

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
    const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .single();

    if (propertyError || !property) {
        console.error("Error fetching property by slug:", propertyError?.message);
        return null;
    }

    return property;
}
