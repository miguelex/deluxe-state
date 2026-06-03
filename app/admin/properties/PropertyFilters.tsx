'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback } from 'react'

interface FilterTranslations {
  filter: string
  filter_search: string
  filter_search_placeholder: string
  filter_type: string
  filter_type_all: string
  filter_type_sale: string
  filter_type_rent: string
  filter_price_range: string
  filter_price_min: string
  filter_price_max: string
  filter_clear: string
  filter_cancel: string
  filter_apply: string
  filter_applying: string
}

interface PropertyFiltersProps {
  t: FilterTranslations
}

export default function PropertyFilters({ t }: PropertyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isOpen, setIsOpen] = useState(false)

  // Read current filter values from URL
  const currentType = searchParams.get('type') || ''
  const currentSearch = searchParams.get('search') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const [type, setType] = useState(currentType)
  const [search, setSearch] = useState(currentSearch)
  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)

  const hasActiveFilters = currentType || currentSearch || currentMinPrice || currentMaxPrice
  const activeCount = [currentType, currentSearch, currentMinPrice, currentMaxPrice].filter(Boolean).length

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (search) params.set('search', search)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    startTransition(() => {
      router.push(`/admin/properties?${params.toString()}`)
    })
    setIsOpen(false)
  }, [type, search, minPrice, maxPrice, router])

  const clearFilters = useCallback(() => {
    setType('')
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    startTransition(() => {
      router.push('/admin/properties')
    })
    setIsOpen(false)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applyFilters()
  }

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white border text-[#19322F] hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm inline-flex items-center gap-2 ${
          hasActiveFilters
            ? 'border-[#006655] ring-1 ring-[#006655]/20'
            : 'border-gray-200'
        }`}
      >
        <span className="material-icons text-base">filter_list</span>
        {t.filter}
        {activeCount > 0 && (
          <span className="bg-[#006655] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ml-0.5">
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#19322F]">{t.filter}</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  {t.filter_clear}
                </button>
              )}
            </div>

            <div className="p-5 space-y-5">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-[#19322F]/70 uppercase tracking-wider mb-2">
                  {t.filter_search}
                </label>
                <div className="relative">
                  <span className="material-icons text-[18px] text-[#19322F]/30 absolute left-3 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.filter_search_placeholder}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#19322F] placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-[#19322F]/70 uppercase tracking-wider mb-2">
                  {t.filter_type}
                </label>
                <div className="flex gap-2">
                  {[
                    { value: '', label: t.filter_type_all },
                    { value: 'SALE', label: t.filter_type_sale },
                    { value: 'RENT', label: t.filter_type_rent },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setType(option.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        type === option.value
                          ? 'bg-[#006655] text-white border-[#006655] shadow-sm'
                          : 'bg-white text-[#19322F]/70 border-gray-200 hover:border-[#006655]/30 hover:text-[#006655]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-[#19322F]/70 uppercase tracking-wider mb-2">
                  {t.filter_price_range}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#19322F]/40 font-medium">$</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t.filter_price_min}
                      className="w-full pl-7 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm text-[#19322F] placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <span className="text-[#19322F]/30 text-xs font-medium">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#19322F]/40 font-medium">$</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t.filter_price_max}
                      className="w-full pl-7 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm text-[#19322F] placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#19322F]/60 hover:text-[#19322F] rounded-lg transition-colors"
              >
                {t.filter_cancel}
              </button>
              <button
                onClick={applyFilters}
                disabled={isPending}
                className="px-5 py-2 bg-[#006655] text-white text-xs font-medium rounded-lg hover:bg-[#006655]/90 shadow-sm transition-all disabled:opacity-50"
              >
                {isPending ? t.filter_applying : t.filter_apply}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
