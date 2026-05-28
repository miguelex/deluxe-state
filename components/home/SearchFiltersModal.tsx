"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/LocaleContext";

interface SearchFiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ID values match DB values — keep in English. Labels come from translations.
const AMENITIES_LIST = [
    { id: "Pool",               icon: "pool",             labelKey: "modal.swimming_pool"   },
    { id: "Gym",                icon: "fitness_center",   labelKey: "modal.gym"              },
    { id: "Parking",            icon: "local_parking",    labelKey: "modal.parking"          },
    { id: "Air Conditioning",   icon: "ac_unit",          labelKey: "modal.air_conditioning" },
    { id: "High-speed Wifi",    icon: "wifi",             labelKey: "modal.wifi"             },
    { id: "Patio / Terrace",    icon: "deck",             labelKey: "modal.patio"            },
];

// Property type values stay English (URL / DB). Labels are translated.
const PROPERTY_TYPES = [
    { value: "Any Type",    labelKey: "modal.any_type"   },
    { value: "House",       labelKey: "modal.house"      },
    { value: "Apartment",   labelKey: "modal.apartment"  },
    { value: "Condo",       labelKey: "modal.condo"      },
    { value: "Townhouse",   labelKey: "modal.townhouse"  },
    { value: "Villa",       labelKey: "modal.villa"      },
    { value: "Penthouse",   labelKey: "modal.penthouse"  },
];

export default function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLocale();

    // Init state from URL if available
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [propertyType, setPropertyType] = useState(searchParams.get("type") || "Any Type");
    const [bedrooms, setBedrooms] = useState(parseInt(searchParams.get("beds") || "0", 10));
    const [bathrooms, setBathrooms] = useState(parseInt(searchParams.get("baths") || "0", 10));
    const [amenities, setAmenities] = useState<string[]>(searchParams.get("amenities")?.split(",") || []);

    if (!isOpen) return null;

    const handleAmenityToggle = (id: string) => {
        setAmenities((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (propertyType && propertyType !== "Any Type") params.set("type", propertyType);
        if (bedrooms > 0) params.set("beds", bedrooms.toString());
        if (bathrooms > 0) params.set("baths", bathrooms.toString());
        if (amenities.length > 0) params.set("amenities", amenities.join(","));

        // Reset to page 1 on new search
        params.set("page", "1");

        router.push(`/?${params.toString()}`, { scroll: false });
        onClose();
    };

    const handleClearFilters = () => {
        setLocation("");
        setMinPrice("");
        setMaxPrice("");
        setPropertyType("Any Type");
        setBedrooms(0);
        setBathrooms(0);
        setAmenities([]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Modal Container */}
            <main className="relative z-20 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        {t("modal.title")}
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
                    {/* Section 1: Location */}
                    <section>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            {t("modal.location")}
                        </label>
                        <div className="relative group">
                            <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                                location_on
                            </span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm"
                                placeholder={t("modal.location_placeholder")}
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Section 2: Price Range */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t("modal.price_range")}
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                                    {t("modal.min_price")}
                                </label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                                        type="number"
                                        placeholder={t("modal.no_min")}
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                                    {t("modal.max_price")}
                                </label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                                        type="number"
                                        placeholder={t("modal.no_max")}
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Property Details */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Property Type */}
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {t("modal.property_type")}
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    {PROPERTY_TYPES.map(({ value, labelKey }) => (
                                        <option key={value} value={value}>
                                            {t(labelKey)}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div className="space-y-4">
                            {/* Beds */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                    {t("modal.bedrooms")}
                                </span>
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBedrooms(Math.max(0, bedrooms - 1));
                                        }}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                                    >
                                        <span className="material-icons text-base">remove</span>
                                    </button>
                                    <span className="text-sm font-semibold w-4 text-center">
                                        {bedrooms > 0 ? `${bedrooms}+` : t("modal.any")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBedrooms(bedrooms + 1);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                                    >
                                        <span className="material-icons text-base">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Baths */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                    {t("modal.bathrooms")}
                                </span>
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBathrooms(Math.max(0, bathrooms - 1));
                                        }}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                                    >
                                        <span className="material-icons text-base">remove</span>
                                    </button>
                                    <span className="text-sm font-semibold w-4 text-center">
                                        {bathrooms > 0 ? `${bathrooms}+` : t("modal.any")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBathrooms(bathrooms + 1);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                                    >
                                        <span className="material-icons text-base">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Amenities */}
                    <section>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            {t("modal.amenities")}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {AMENITIES_LIST.map((amenity) => {
                                const isSelected = amenities.includes(amenity.id);
                                return (
                                    <label
                                        key={amenity.id}
                                        className="cursor-pointer group relative"
                                    >
                                        <input
                                            checked={isSelected}
                                            onChange={() => handleAmenityToggle(amenity.id)}
                                            className="peer sr-only"
                                            type="checkbox"
                                        />
                                        <div
                                            className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                                                isSelected
                                                    ? "border-mosque bg-mosque/10 text-mosque font-medium"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                            }`}
                                        >
                                            <span
                                                className={`material-icons text-lg ${
                                                    isSelected
                                                        ? "text-mosque"
                                                        : "text-gray-400 group-hover:text-gray-500"
                                                }`}
                                            >
                                                {amenity.icon}
                                            </span>
                                            {t(amenity.labelKey)}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"></div>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
                    >
                        {t("modal.clear_filters")}
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyFilters}
                        className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
                    >
                        {t("modal.apply_filters")}
                        <span className="material-icons text-sm">arrow_forward</span>
                    </button>
                </footer>
            </main>
        </div>
    );
}
