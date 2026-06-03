'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function UserSearch({ defaultValue }: { defaultValue: string }) {
  const [search, setSearch] = useState(defaultValue)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setSearch(value)
    startTransition(() => {
      const params = new URLSearchParams()
      if (value) params.set('search', value)
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  return (
    <div className="relative group w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className={`material-icons text-xl transition-colors ${
          isPending ? 'text-[#006655] animate-pulse' : 'text-[#19322F]/40 group-focus-within:text-[#006655]'
        }`}>
          search
        </span>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-[#19322F] shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:bg-white transition-all text-sm"
        placeholder="Search by name, email..."
      />
    </div>
  )
}
