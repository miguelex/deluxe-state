'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'

interface NavTranslations {
  dashboard: string
  listings: string
  users: string
  logout: string
  administrator: string
}

interface AdminNavbarProps {
  user: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
  t: NavTranslations
}

export default function AdminNavbar({ user, t }: AdminNavbarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: t.dashboard, href: '/admin', icon: 'dashboard' },
    { name: t.listings, href: '/admin/properties', icon: 'apartment' },
    { name: t.users, href: '/admin/users', icon: 'group' },
  ]

  const activeItem = navItems.find((item) =>
    item.href === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(item.href)
  )

  const displayName = user.fullName || user.email?.split('@')[0] || 'Admin'
  const avatarUrl =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=006655&color=fff&bold=true&size=80`

  return (
    <nav className="bg-white border-b border-[#19322F]/5 px-4 sm:px-6 lg:px-8 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <span className="material-icons text-[#006655] text-2xl">apartment</span>
            <span className="font-bold text-lg text-[#19322F] tracking-tight">LuxeEstate</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#006655] bg-[#006655]/5'
                      : 'text-[#19322F]/60 hover:text-[#006655] hover:bg-[#006655]/5'
                  }`}
                >
                  <span className="material-icons text-[18px]">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Route indicator + User Info */}
        <div className="flex items-center gap-4">
          {/* Current route breadcrumb */}
          {activeItem && (
            <div className="hidden lg:flex items-center text-xs text-[#19322F]/40 gap-1">
              <span className="material-icons text-[14px]">home</span>
              <span>/</span>
              <span>Admin</span>
              <span>/</span>
              <span className="text-[#006655] font-medium">{activeItem.name}</span>
            </div>
          )}

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-[#19322F]/10" />

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-[#19322F] leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-[#19322F]/40 leading-tight">
                {t.administrator}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-[#006655]/20 ring-2 ring-transparent hover:ring-[#006655]/30 transition-all">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Logout */}
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#19322F]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title={t.logout}
            >
              <span className="material-icons text-[18px]">logout</span>
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
