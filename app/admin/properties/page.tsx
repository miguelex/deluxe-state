import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/getLocale'
import { getTranslations, resolvePath } from '@/lib/i18n'
import Image from 'next/image'
import PropertyPagination from './PropertyPagination'
import PropertyFilters from './PropertyFilters'
import Link from 'next/link'
import { togglePropertyStatus } from './actions'

const PROPERTIES_PER_PAGE = 10

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    type?: string
    search?: string
    minPrice?: string
    maxPrice?: string
  }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const filterType = params.type || ''
  const filterSearch = params.search || ''
  const filterMinPrice = params.minPrice || ''
  const filterMaxPrice = params.maxPrice || ''

  const locale = await getLocale()
  const translations = getTranslations(locale)
  const t = (key: string) => resolvePath(translations, key)

  const supabase = await createClient()

  // Stats query (unfiltered totals)
  const { data: allPropertiesForStats } = await supabase
    .from('properties')
    .select('type')

  const totalAll = allPropertiesForStats?.length || 0
  const totalSale = allPropertiesForStats?.filter((p) => p.type === 'SALE').length || 0
  const totalRent = allPropertiesForStats?.filter((p) => p.type === 'RENT').length || 0

  // Filtered query
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filterType) {
    query = query.eq('type', filterType)
  }
  if (filterSearch) {
    query = query.or(`title.ilike.%${filterSearch}%,location.ilike.%${filterSearch}%`)
  }
  if (filterMinPrice) {
    query = query.gte('price', parseFloat(filterMinPrice))
  }
  if (filterMaxPrice) {
    query = query.lte('price', parseFloat(filterMaxPrice))
  }

  const { data: filteredProperties, error, count } = await query

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

  const properties = filteredProperties || []
  const totalProperties = count || properties.length
  const totalPages = Math.ceil(totalProperties / PROPERTIES_PER_PAGE)
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE
  const paginatedProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE)

  // Active filters for display
  const activeFilters = {
    type: filterType,
    search: filterSearch,
    minPrice: filterMinPrice,
    maxPrice: filterMaxPrice,
  }

  // Resolved translations for client components
  const filterT = {
    filter: t('admin.properties.filter'),
    filter_search: t('admin.properties.filter_search'),
    filter_search_placeholder: t('admin.properties.filter_search_placeholder'),
    filter_type: t('admin.properties.filter_type'),
    filter_type_all: t('admin.properties.filter_type_all'),
    filter_type_sale: t('admin.properties.filter_type_sale'),
    filter_type_rent: t('admin.properties.filter_type_rent'),
    filter_price_range: t('admin.properties.filter_price_range'),
    filter_price_min: t('admin.properties.filter_price_min'),
    filter_price_max: t('admin.properties.filter_price_max'),
    filter_clear: t('admin.properties.filter_clear'),
    filter_cancel: t('admin.properties.filter_cancel'),
    filter_apply: t('admin.properties.filter_apply'),
    filter_applying: t('admin.properties.filter_applying'),
  }

  const paginationT = {
    showing: t('admin.properties.showing'),
    to: t('admin.properties.to'),
    of: t('admin.properties.of'),
    results: t('admin.properties.results'),
    previous: t('admin.properties.previous'),
    next: t('admin.properties.next'),
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#19322F] tracking-tight">
            {t('admin.properties.title')}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('admin.properties.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PropertyFilters t={filterT} />
          <Link 
            href="/admin/properties/new"
            className="bg-[#006655] hover:bg-[#006655]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span className="material-icons text-base">add</span>
            {t('admin.properties.add_property')}
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('admin.properties.total_listings')}</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalAll}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655]">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('admin.properties.for_sale')}</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalSale}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#006655]">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('admin.properties.for_rent')}</p>
            <p className="text-2xl font-bold text-[#19322F] mt-1">{totalRent}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
      </div>

      {/* Active Filters Banner */}
      {(activeFilters.type || activeFilters.search || activeFilters.minPrice || activeFilters.maxPrice) && (
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-[#19322F]/50 text-xs font-medium">{t('admin.properties.active_filters')}</span>
          {activeFilters.search && (
            <span className="inline-flex items-center gap-1 bg-[#006655]/10 text-[#006655] px-2.5 py-1 rounded-md text-xs font-medium">
              <span className="material-icons text-[14px]">search</span>
              &ldquo;{activeFilters.search}&rdquo;
            </span>
          )}
          {activeFilters.type && (
            <span className="inline-flex items-center gap-1 bg-[#006655]/10 text-[#006655] px-2.5 py-1 rounded-md text-xs font-medium">
              <span className="material-icons text-[14px]">label</span>
              {activeFilters.type === 'SALE' ? t('admin.properties.for_sale') : t('admin.properties.for_rent')}
            </span>
          )}
          {(activeFilters.minPrice || activeFilters.maxPrice) && (
            <span className="inline-flex items-center gap-1 bg-[#006655]/10 text-[#006655] px-2.5 py-1 rounded-md text-xs font-medium">
              <span className="material-icons text-[14px]">attach_money</span>
              {activeFilters.minPrice ? `$${Number(activeFilters.minPrice).toLocaleString()}` : '$0'}
              {' — '}
              {activeFilters.maxPrice ? `$${Number(activeFilters.maxPrice).toLocaleString()}` : '∞'}
            </span>
          )}
          <span className="text-[#19322F]/40 text-xs">
            ({totalProperties} {totalProperties !== 1 ? t('admin.properties.result_plural') : t('admin.properties.result_singular')})
          </span>
        </div>
      )}

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">{t('admin.properties.property_details')}</div>
          <div className="col-span-2">{t('admin.properties.price')}</div>
          <div className="col-span-2">{t('admin.properties.status')}</div>
          <div className="col-span-2 text-right">{t('admin.properties.actions')}</div>
        </div>

        {/* Property List Items */}
        {paginatedProperties.map((property, index) => {
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
                      {property.bedrooms} {t('admin.properties.beds')}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-[14px]">bathtub</span>
                      {property.bathrooms} {t('admin.properties.baths')}
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
                  {property.type === 'SALE' ? t('admin.properties.for_sale') : t('admin.properties.for_rent')}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ml-2 ${
                    property.is_active !== false
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      property.is_active !== false ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                  {property.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                <Link
                  href={`/admin/properties/${property.id}/edit`}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all"
                  title="Edit"
                >
                  <span className="material-icons text-xl">edit</span>
                </Link>
                <form action={async () => {
                  'use server'
                  await togglePropertyStatus(property.id, property.is_active ?? true)
                }}>
                  <button
                    type="submit"
                    className={`p-2 rounded-lg transition-all ${
                      property.is_active !== false 
                        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={property.is_active !== false ? 'Deactivate' : 'Activate'}
                  >
                    <span className="material-icons text-xl">
                      {property.is_active !== false ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {paginatedProperties.length === 0 && (
          <div className="px-6 py-16 text-center">
            <span className="material-icons text-4xl text-gray-200 mb-3 block">home_work</span>
            <p className="text-gray-400 text-sm">{t('admin.properties.no_properties')}</p>
          </div>
        )}

        {/* Pagination inside card */}
        {totalPages > 1 && (
          <PropertyPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalProperties={totalProperties}
            propertiesPerPage={PROPERTIES_PER_PAGE}
            filters={activeFilters}
            t={paginationT}
          />
        )}
      </div>
    </div>
  )
}
