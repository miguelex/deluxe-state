import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/getLocale'
import { getTranslations, resolvePath } from '@/lib/i18n'
import AdminNavbar from './AdminNavbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const locale = await getLocale()
  const translations = getTranslations(locale)
  const t = (key: string) => resolvePath(translations, key)

  const navUser = {
    email: user?.email || '',
    fullName: user?.user_metadata?.full_name || undefined,
    avatarUrl: user?.user_metadata?.avatar_url || undefined,
  }

  const navT = {
    dashboard: t('admin.nav.dashboard'),
    listings: t('admin.nav.listings'),
    users: t('admin.nav.users'),
    logout: t('admin.nav.logout'),
    administrator: t('admin.nav.administrator'),
  }

  return (
    <div className="min-h-screen bg-[#EEF6F6] font-sans flex flex-col">
      {/* Top Navbar */}
      <AdminNavbar user={navUser} t={navT} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
