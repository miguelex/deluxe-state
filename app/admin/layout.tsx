'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Listings', href: '/admin/properties' },
    { name: 'Users', href: '/admin/users' },
  ]

  return (
    <div className="min-h-screen bg-[#EEF6F6] font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-[#19322F]/5 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <span className="material-icons text-[#006655] text-2xl">apartment</span>
              <span className="font-bold text-lg text-[#19322F] tracking-tight">LuxeEstate</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-1 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#006655] border-b-2 border-[#006655]'
                        : 'text-[#19322F]/60 hover:text-[#006655]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="text-[#19322F]/60 hover:text-[#006655] transition-colors">
              <span className="material-icons text-xl">search</span>
            </button>
            <button className="text-[#19322F]/60 hover:text-[#006655] transition-colors relative">
              <span className="material-icons text-xl">notifications</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button className="flex items-center gap-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-[#19322F]/10 flex items-center justify-center overflow-hidden border border-[#19322F]/10">
                <span className="material-icons text-[#19322F]/60 text-lg">person</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
