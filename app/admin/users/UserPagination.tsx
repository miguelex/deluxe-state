import Link from 'next/link'

interface UserPaginationProps {
  currentPage: number
  totalPages: number
  totalUsers: number
  usersPerPage: number
  searchQuery: string
  activeTab: string
}

export default function UserPagination({
  currentPage,
  totalPages,
  totalUsers,
  usersPerPage,
  searchQuery,
  activeTab,
}: UserPaginationProps) {
  const startItem = (currentPage - 1) * usersPerPage + 1
  const endItem = Math.min(currentPage * usersPerPage, totalUsers)

  function buildHref(page: number) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    if (searchQuery) params.set('search', searchQuery)
    if (activeTab && activeTab !== 'all') params.set('tab', activeTab)
    return `/admin/users?${params.toString()}`
  }

  // Generate page numbers to display
  const pages: (number | string)[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <footer className="mt-6 border-t border-[#19322F]/5 pt-6 pb-2">
      <div className="flex items-center justify-between">
        {/* Desktop */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#19322F]/60">
              Showing <span className="font-medium text-[#19322F]">{startItem}</span> to{' '}
              <span className="font-medium text-[#19322F]">{endItem}</span> of{' '}
              <span className="font-medium text-[#19322F]">{totalUsers}</span> users
            </p>
          </div>
          <div>
            <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md -space-x-px">
              {currentPage > 1 ? (
                <Link
                  href={buildHref(currentPage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-[#19322F]/50 hover:text-[#006655] transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </Link>
              ) : (
                <span className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-[#19322F]/20 cursor-not-allowed">
                  <span className="material-icons text-xl">chevron_left</span>
                </span>
              )}

              {pages.map((page, i) =>
                typeof page === 'string' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-[#19322F]/40"
                  >
                    ...
                  </span>
                ) : page === currentPage ? (
                  <span
                    key={page}
                    className="z-10 bg-[#006655] text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm"
                    aria-current="page"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={buildHref(page)}
                    className="bg-transparent text-[#19322F]/70 hover:bg-white hover:text-[#006655] relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors"
                  >
                    {page}
                  </Link>
                )
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildHref(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-[#19322F]/50 hover:text-[#006655] transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </Link>
              ) : (
                <span className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-[#19322F]/20 cursor-not-allowed">
                  <span className="material-icons text-xl">chevron_right</span>
                </span>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between w-full sm:hidden">
          {currentPage > 1 ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[#19322F] bg-white border border-gray-300 hover:bg-gray-50"
            >
              Previous
            </Link>
          ) : (
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[#19322F]/30 bg-white border border-gray-200 cursor-not-allowed">
              Previous
            </span>
          )}
          {currentPage < totalPages ? (
            <Link
              href={buildHref(currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[#19322F] bg-white border border-gray-300 hover:bg-gray-50"
            >
              Next
            </Link>
          ) : (
            <span className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[#19322F]/30 bg-white border border-gray-200 cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
