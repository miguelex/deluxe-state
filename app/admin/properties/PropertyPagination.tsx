import Link from 'next/link'

interface PropertyPaginationProps {
  currentPage: number
  totalPages: number
  totalProperties: number
  propertiesPerPage: number
}

export default function PropertyPagination({
  currentPage,
  totalPages,
  totalProperties,
  propertiesPerPage,
}: PropertyPaginationProps) {
  const startItem = (currentPage - 1) * propertiesPerPage + 1
  const endItem = Math.min(currentPage * propertiesPerPage, totalProperties)

  function buildHref(page: number) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    return `/admin/properties?${params.toString()}`
  }

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
      <div className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-medium text-[#19322F]">{startItem}</span> to{' '}
        <span className="font-medium text-[#19322F]">{endItem}</span> of{' '}
        <span className="font-medium text-[#19322F]">{totalProperties}</span> results
      </div>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">
            Previous
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
    </div>
  )
}
