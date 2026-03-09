import { Property } from "@/app/data/properties";

export default function NewMarketProperties({ properties }: { properties: Property[] }) {
    return (
        <section>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
                    <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
                </div>
                <div className="hidden md:flex bg-white p-1 rounded-lg">
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Buy</button>
                    <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Rent</button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property, idx) => (
                    <article
                        key={property.id}
                        className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${idx === 4 ? "hidden xl:flex" : idx === 5 ? "hidden lg:flex" : ""
                            }`}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                                alt={property.imageAlt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={property.imageUrl}
                            />
                            <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark">
                                <span className="material-icons text-lg">favorite_border</span>
                            </button>
                            <div
                                className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${property.type === "SALE" ? "bg-nordic-dark/90" : "bg-mosque/90"
                                    }`}
                            >
                                {property.type === "SALE" ? "FOR SALE" : "FOR RENT"}
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-lg text-nordic-dark">
                                    ${property.price.toLocaleString()}
                                    {property.priceSuffix && (
                                        <span className="text-sm font-normal text-nordic-muted">{property.priceSuffix}</span>
                                    )}
                                </h3>
                            </div>
                            <h4 className="text-nordic-dark font-medium truncate mb-1">
                                {property.title}
                            </h4>
                            <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-nordic-muted text-xs">
                                    <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.bedrooms}
                                </div>
                                <div className="flex items-center gap-1 text-nordic-muted text-xs">
                                    <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.bathrooms}
                                </div>
                                <div className="flex items-center gap-1 text-nordic-muted text-xs">
                                    <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area.toLocaleString()}m²
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md">
                    Load more properties
                </button>
            </div>
        </section>
    );
}
