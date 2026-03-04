import { featuredProperties, newMarketProperties } from "./data/properties";

export default function Home() {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                <span className="material-icons text-white text-lg">apartment</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-nordic-dark">
                LuxeEstate
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">
                Buy
              </a>
              <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">
                Rent
              </a>
              <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">
                Sell
              </a>
              <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">
                Saved Homes
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-nordic-dark hover:text-mosque transition-colors">
                <span className="material-icons">search</span>
              </button>
              <button className="text-nordic-dark hover:text-mosque transition-colors relative">
                <span className="material-icons">notifications_none</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
              </button>
              <button className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                  <img
                    alt="Profile"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
          <div className="px-4 py-2 space-y-1">
            <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">Buy</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">Rent</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">Sell</a>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">Saved Homes</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
              Find your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">sanctuary</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              .
            </h1>
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
                  search
                </span>
              </div>
              <input
                className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
                placeholder="Search by city, neighborhood, or address..."
                type="text"
              />
              <button className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20">
                Search
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
              <button className="whitespace-nowrap px-5 py-2 rounded-full bg-nordic-dark text-white text-sm font-medium shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5">
                All
              </button>
              <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5">
                House
              </button>
              <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5">
                Apartment
              </button>
              <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5">
                Villa
              </button>
              <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5">
                Penthouse
              </button>
              <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
              <button className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors">
                <span className="material-icons text-base">tune</span> Filters
              </button>
            </div>
          </div>
        </section>

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
            {featuredProperties.map((property) => (
              <div key={property.id} className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    alt={property.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={property.imageUrl}
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
                      ${property.price.toLocaleString()}{property.priceSuffix || ""}
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
            {newMarketProperties.map((property, idx) => (
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
      </main>
    </>
  );
}
