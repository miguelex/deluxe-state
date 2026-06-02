'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Home, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Properties', href: '/admin/properties', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity">
            Luxe Admin
          </Link>
          <p className="text-sm text-zinc-500 mt-1">Management Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
