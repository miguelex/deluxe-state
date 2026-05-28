import { getFeaturedProperties, getMarketProperties, PAGE_SIZE } from "@/lib/getProperties";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewMarketProperties from "@/components/home/NewMarketProperties";

interface HomePageProps {
  searchParams: Promise<{ 
    page?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    type?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const filters = {
    location: params.location,
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
    type: params.type,
    beds: params.beds ? parseInt(params.beds, 10) : undefined,
    baths: params.baths ? parseInt(params.baths, 10) : undefined,
    amenities: params.amenities ? params.amenities.split(",") : undefined,
  };

  const [featuredProperties, marketData] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties(currentPage, PAGE_SIZE, filters),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Hero />
      <FeaturedCollections properties={featuredProperties} />
      <NewMarketProperties
        properties={marketData.properties}
        currentPage={marketData.page}
        totalPages={marketData.totalPages}
      />
    </main>
  );
}
