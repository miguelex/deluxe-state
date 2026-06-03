import Link from 'next/link'

interface PaginationTranslations {
  showing: string
  to: string
  of: string
  results: string
  previous: string
  next: string
}

interface PropertyPaginationProps {
  currentPage: number
  totalPages: number
  totalProperties: number
  propertiesPerPage: number
  filters?: {
    type?: string
    search?: string
    minPrice?: string
    maxPrice?: string
  }
  t: PaginationTranslations
}

export default function PropertyPagination({
  currentPage,
  totalPages,
  totalProperties,
  propertiesPerPage,
  filters = {},
  t,
}: PropertyPaginationProps) {
  const startItem = (currentPage - 1) * propertiesPerPage + 1
  const endItem = Math.min(currentPage * propertiesPerPage, totalProperties)

  function buildHref(page: number) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    if (filters.type) params.set('type', filters.type)
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    return `/admin/properties?${params.toString()}`
  }

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
      <div className="text-sm text-gray-500">
        {t.showing}{' '}
        <span className="font-medium text-[#19322F]">{startItem}</span> {t.to}{' '}
        <span className="font-medium text-[#19322F]">{endItem}</span> {t.of}{' '}
        <span className="font-medium text-[#19322F]">{totalProperties}</span> {t.results}
      </div>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white transition-colors"
          >
            {t.previous}
          </Link>
        ) : (
          <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">
            {t.previous}
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white transition-colors"
          >
            {t.next}
          </Link>
        ) : (
          <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">
            {t.next}
          </span>
        )}
      </div>
    </div>
  )
}
