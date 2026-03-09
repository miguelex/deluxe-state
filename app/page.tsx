import { featuredProperties, newMarketProperties } from "./data/properties";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewMarketProperties from "@/components/home/NewMarketProperties";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Hero />
      <FeaturedCollections properties={featuredProperties} />
      <NewMarketProperties properties={newMarketProperties} />
    </main>
  );
}
