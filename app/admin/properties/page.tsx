import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import PropertyPagination from './PropertyPagination'

const PROPERTIES_PER_PAGE = 5

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))

  const supabase = await createClient()

  const { data: allProperties, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 text-sm">
          <span className="material-icons text-base mr-2 align-middle">error</span>
          Error loading properties: {error.message}
        </div>
      </div>
    )
  }

  const properties = allProperties || []
  const totalProperties = count || properties.length
  const totalPages = Math.ceil(totalProperties / PROPERTIES_PER_PAGE)
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE
  const paginatedProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE)

  // Stats
  const totalActive = properties.filter((p) => p.type === 'RENT' || p.type === 'SALE').length
  const totalSale = properties.filter((p) => p.type === 'SALE').length
  const totalRent = properties.filter((p) => p.type === 'RENT').length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
            My Properties
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your portfolio and track performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-[#19322F] hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span>
            Filter
          </button>
          <button className="bg-[#006655] hover:bg-[#006655]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span>
            Add New Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Listings</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalProperties}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655]">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">For Sale</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalSale}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#006655]">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">For Rent</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalRent}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Property List Items */}
        {paginatedProperties.map((property, index) => {
          const isActive = property.type === 'SALE' || property.type === 'RENT'
          const isSale = property.type === 'SALE'
          const isLastItem = index === paginatedProperties.length - 1

          return (
            <div
              key={property.id}
              className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#EEF6F6] transition-colors items-center ${
                !isLastItem ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* Property Details */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.image_alt || property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="112px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-gray-300 text-2xl">image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#19322F] group-hover:text-[#006655] transition-colors cursor-pointer">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-[14px]">bed</span>
                      {property.bedrooms} Beds
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-[14px]">bathtub</span>
                      {property.bathrooms} Baths
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{property.area?.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 md:col-span-2">
                <div className="text-base font-semibold text-[#19322F]">
                  ${property.price?.toLocaleString()}
                </div>
                {property.price_suffix && (
                  <div className="text-xs text-gray-400">{property.price_suffix}</div>
                )}
              </div>

              {/* Status */}
              <div className="col-span-6 md:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    isSale
                      ? 'bg-[#D9ECC8] text-[#006655] border-[#006655]/10'
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      isSale ? 'bg-[#006655]' : 'bg-orange-500'
                    }`}
                  />
                  {property.type === 'SALE' ? 'For Sale' : 'For Rent'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                <button
                  className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all"
                  title="Edit Property"
                >
                  <span className="material-icons text-xl">edit</span>
                </button>
                <button
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Delete Property"
                >
                  <span className="material-icons text-xl">delete_outline</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {paginatedProperties.length === 0 && (
          <div className="px-6 py-16 text-center">
            <span className="material-icons text-4xl text-gray-200 mb-3 block">home_work</span>
            <p className="text-gray-400 text-sm">No properties found.</p>
          </div>
        )}

        {/* Pagination inside card */}
        {totalPages > 1 && (
          <PropertyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalProperties={totalProperties}
            propertiesPerPage={PROPERTIES_PER_PAGE}
          />
        )}
      </div>
    </div>
  )
}
