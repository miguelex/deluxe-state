import { getFeaturedProperties, getMarketProperties, PAGE_SIZE } from "@/lib/getProperties";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewMarketProperties from "@/components/home/NewMarketProperties";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const [featuredProperties, marketData] = await Promise.all([
    getFeaturedProperties(),
    getMarketProperties(currentPage, PAGE_SIZE),
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
