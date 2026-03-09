import { Property } from "@/lib/getProperties";

export default function FeaturedCollections({ properties }: { properties: Property[] }) {
    return (
        <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
                    <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
                </div>
                <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                    View all <span className="material-icons text-sm">arrow_forward</span>
                </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {properties.map((property) => (
                    <div key={property.id} className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer">
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                            <img
                                alt={property.image_alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={property.image_url}
                            />
                            {property.tags.length > 0 && (
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark">
                                    {property.tags[0]}
                                </div>
                            )}
                            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all">
                                <span className="material-icons text-xl">favorite_border</span>
                            </button>
                            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        </div>
                        <div className="p-6 relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">
                                        {property.title}
                                    </h3>
                                    <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                                        <span className="material-icons text-sm">place</span> {property.location}
                                    </p>
                                </div>
                                <span className="text-xl font-semibold text-mosque">
                                    ${property.price.toLocaleString()}{property.price_suffix || ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
                                <div className="flex items-center gap-2 text-nordic-muted text-sm">
                                    <span className="material-icons text-lg">king_bed</span> {property.bedrooms} Beds
                                </div>
                                <div className="flex items-center gap-2 text-nordic-muted text-sm">
                                    <span className="material-icons text-lg">bathtub</span> {property.bathrooms} Baths
                                </div>
                                <div className="flex items-center gap-2 text-nordic-muted text-sm">
                                    <span className="material-icons text-lg">square_foot</span> {property.area.toLocaleString()} m²
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
