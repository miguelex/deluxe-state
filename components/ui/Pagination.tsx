import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageHref = (page: number) =>
        page === 1 ? "/" : `/?page=${page}`;

    // Build visible page numbers: always show first, last, current ±1, with ellipsis
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const delta = 1;
        const left = currentPage - delta;
        const right = currentPage + delta;

        let prev: number | undefined;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                if (prev !== undefined && i - prev > 1) {
                    pages.push("...");
                }
                pages.push(i);
                prev = i;
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-center gap-1"
        >
            {/* Prev arrow */}
            {currentPage > 1 ? (
                <Link
                    href={getPageHref(currentPage - 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all"
                    aria-label="Previous page"
                >
                    <span className="material-icons text-lg">chevron_left</span>
                </Link>
            ) : (
                <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-nordic-dark/10 text-nordic-dark/30 cursor-not-allowed">
                    <span className="material-icons text-lg">chevron_left</span>
                </span>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page, idx) =>
                page === "..." ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="flex items-center justify-center w-9 h-9 text-nordic-muted text-sm select-none"
                    >
                        ···
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={getPageHref(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === currentPage
                                ? "bg-nordic-dark text-white shadow-sm"
                                : "border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque"
                            }`}
                    >
                        {page}
                    </Link>
                )
            )}

            {/* Next arrow */}
            {currentPage < totalPages ? (
                <Link
                    href={getPageHref(currentPage + 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque transition-all"
                    aria-label="Next page"
                >
                    <span className="material-icons text-lg">chevron_right</span>
                </Link>
            ) : (
                <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-nordic-dark/10 text-nordic-dark/30 cursor-not-allowed">
                    <span className="material-icons text-lg">chevron_right</span>
                </span>
            )}
        </nav>
    );
}
