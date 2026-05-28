"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFiltersModal from "./SearchFiltersModal";
import { useLocale } from "@/lib/LocaleContext";

export default function Hero() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("location") || "");
    const { t } = useLocale();

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set("location", searchQuery);
        } else {
            params.delete("location");
        }
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // The URL param value stays in English (DB compatibility) but label is translated
    const handleQuickFilter = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === "All") {
            params.delete("type");
        } else {
            params.set("type", type);
        }
        params.set("page", "1");
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    // Quick filter pills: { urlValue, labelKey }
    const QUICK_FILTERS = [
        { urlValue: "All",        labelKey: "hero.filter_all"        },
        { urlValue: "House",      labelKey: "hero.filter_house"      },
        { urlValue: "Apartment",  labelKey: "hero.filter_apartment"  },
        { urlValue: "Villa",      labelKey: "hero.filter_villa"      },
        { urlValue: "Penthouse",  labelKey: "hero.filter_penthouse"  },
    ];

    const activeType = searchParams.get("type");

    return (
        <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
                    {t("hero.title_find")}{" "}
                    <span className="relative inline-block">
                        <span className="relative z-10 font-medium">{t("hero.title_sanctuary")}</span>
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
                        placeholder={t("hero.search_placeholder")}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
                    >
                        {t("hero.search_button")}
                    </button>
                </div>
                <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
                    {QUICK_FILTERS.map(({ urlValue, labelKey }) => {
                        const isActive =
                            urlValue === "All"
                                ? !activeType || activeType === "Any Type" || activeType === "All"
                                : activeType === urlValue;
                        return (
                            <button
                                key={urlValue}
                                type="button"
                                onClick={() => handleQuickFilter(urlValue)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 hover:-translate-y-0.5"
                                        : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
                                }`}
                            >
                                {t(labelKey)}
                            </button>
                        );
                    })}
                    <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
                    <button
                        type="button"
                        onClick={() => setIsFiltersOpen(true)}
                        className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
                    >
                        <span className="material-icons text-base">tune</span> {t("hero.filters")}
                    </button>
                </div>
            </div>
            <SearchFiltersModal isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
        </section>
    );
}
