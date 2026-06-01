import Link from "next/link";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { getLocale } from "@/lib/getLocale";
import { getTranslations } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function Navbar() {
    const locale = await getLocale();
    const translations = getTranslations(locale);
    const t = (key: string): string => {
        const keys = key.split(".");
        let current: unknown = translations;
        for (const k of keys) {
            if (typeof current === "object" && current !== null && k in (current as object)) {
                current = (current as Record<string, unknown>)[k];
            } else return key;
        }
        return typeof current === "string" ? current : key;
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                            <span className="material-icons text-white text-lg">apartment</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-nordic-dark">
                            LuxeEstate
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">
                            {t("nav.buy")}
                        </a>
                        <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">
                            {t("nav.rent")}
                        </a>
                        <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">
                            {t("nav.sell")}
                        </a>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Language Selector */}
                        <LanguageSelector />

                        <button className="text-nordic-dark hover:text-mosque transition-colors">
                            <span className="material-icons">search</span>
                        </button>
                        <button className="text-nordic-dark hover:text-mosque transition-colors relative">
                            <span className="material-icons">notifications_none</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
                        </button>
                        
                        <div className="pl-2 border-l border-nordic-dark/10 ml-2 flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                                            <img
                                                alt={user.user_metadata.full_name || "Profile"}
                                                className="w-full h-full object-cover"
                                                src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                                            />
                                        </div>
                                    </div>
                                    <form action={signOut}>
                                        <button type="submit" className="text-sm font-medium text-nordic-dark hover:text-mosque transition-colors px-3 py-2 rounded-md hover:bg-black/5">
                                            {t("nav.logout")}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <Link href="/login" className="text-sm font-medium text-nordic-dark hover:text-mosque transition-colors px-3 py-2 rounded-md hover:bg-black/5">
                                    {t("nav.login")}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
                <div className="px-4 py-2 space-y-1">
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t("nav.buy")}</a>
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t("nav.rent")}</a>
                    <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t("nav.sell")}</a>
                </div>
            </div>
        </nav>
    );
}
