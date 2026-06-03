import { createClient } from '@/lib/supabase/server'
import { getLocale } from '@/lib/getLocale'
import { getTranslations, resolvePath } from '@/lib/i18n'
import RoleSelector from './RoleSelector'
import UserSearch from './UserSearch'
import UserPagination from './UserPagination'

const USERS_PER_PAGE = 5

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; tab?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const searchQuery = params.search || ''
  const activeTab = params.tab || 'all'

  const locale = await getLocale()
  const translations = getTranslations(locale)
  const t = (key: string) => resolvePath(translations, key)

  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select(`
      id,
      email,
      created_at,
      user_roles (
        role
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (searchQuery) {
    query = query.ilike('email', `%${searchQuery}%`)
  }

  const { data: allUsers, error, count } = await query

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 text-sm">
          <span className="material-icons text-base mr-2 align-middle">error</span>
          Error loading users: {error.message}
        </div>
      </div>
    )
  }

  // Filter by role tab
  const filteredUsers = (allUsers || []).filter((u) => {
    const role = Array.isArray(u.user_roles)
      ? u.user_roles[0]?.role || 'user'
      : (u.user_roles as { role: string } | null)?.role || 'user'
    if (activeTab === 'all') return true
    if (activeTab === 'admins') return role === 'admin'
    if (activeTab === 'users') return role === 'user'
    return true
  })

  const totalUsers = filteredUsers.length
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const users = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE)

  // Count stats
  const totalAll = allUsers?.length || 0
  const totalAdmins = (allUsers || []).filter((u) => {
    const role = Array.isArray(u.user_roles)
      ? u.user_roles[0]?.role || 'user'
      : (u.user_roles as { role: string } | null)?.role || 'user'
    return role === 'admin'
  }).length
  const totalRegularUsers = totalAll - totalAdmins

  const tabs = [
    { id: 'all', label: t('admin.users.tab_all'), count: totalAll },
    { id: 'users', label: t('admin.users.tab_users'), count: totalRegularUsers },
    { id: 'admins', label: t('admin.users.tab_admins'), count: totalAdmins },
  ]

  // Translations for client components
  const roleSelectorT = {
    change_role: t('admin.users.change_role'),
    updating: t('admin.users.updating'),
    role_admin: t('admin.users.role_admin'),
    role_user: t('admin.users.role_user'),
    suspend_user: t('admin.users.suspend_user'),
  }

  const paginationT = {
    showing: t('admin.users.showing'),
    to: t('admin.users.to'),
    of: t('admin.users.of'),
    users_label: t('admin.users.users_label'),
    previous: t('admin.users.previous'),
    next: t('admin.users.next'),
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <header className="pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#19322F]">
              {t('admin.users.title')}
            </h1>
            <p className="text-[#19322F]/60 mt-1 text-sm">
              {t('admin.users.subtitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <UserSearch
              defaultValue={searchQuery}
              placeholder={t('admin.users.search_placeholder')}
            />
            <button className="bg-[#006655] hover:bg-[#006655]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-[#006655]/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="material-icons text-base">add</span>
              {t('admin.users.add_user')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 border-b border-[#19322F]/10 overflow-x-auto">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`/admin/users?tab=${tab.id}&search=${searchQuery}`}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#006655] border-b-2 border-[#006655] font-semibold'
                  : 'text-[#19322F]/60 hover:text-[#19322F]'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
            </a>
          ))}
        </div>
      </header>

      {/* Column Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#19322F]/50 mb-2 mt-2">
        <div className="col-span-5">{t('admin.users.user_details')}</div>
        <div className="col-span-3">{t('admin.users.role_status')}</div>
        <div className="col-span-2">{t('admin.users.joined')}</div>
        <div className="col-span-2 text-right">{t('admin.users.actions')}</div>
      </div>

      {/* User Cards */}
      <div className="space-y-3">
        {users.map((u, index) => {
          const role = Array.isArray(u.user_roles)
            ? u.user_roles[0]?.role || 'user'
            : (u.user_roles as { role: string } | null)?.role || 'user'

          const isAdmin = role === 'admin'
          const initial = u.email?.[0]?.toUpperCase() || '?'
          const userId = `USR-${u.id.substring(0, 4).toUpperCase()}`
          const joinedDate = new Date(u.created_at).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })

          // First card has highlighted bg
          const isFirst = index === 0 && currentPage === 1 && activeTab === 'all'

          return (
            <div
              key={u.id}
              className={`group relative rounded-xl p-5 shadow-sm flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all duration-200 ${
                isFirst
                  ? 'bg-[#D9ECC8] border border-transparent hover:shadow-md'
                  : 'bg-white border border-gray-100 hover:bg-[#D9ECC8] hover:border-transparent'
              }`}
            >
              {/* User Details */}
              <div className="col-span-12 md:col-span-5 flex items-center w-full">
                <div className="relative shrink-0">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${
                    isAdmin
                      ? 'bg-[#19322F] text-white'
                      : 'bg-[#006655]/10 text-[#006655]'
                  }`}>
                    {initial}
                  </div>
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                    isAdmin ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="ml-4 overflow-hidden">
                  <div className="text-sm font-bold text-[#19322F] truncate">
                    {u.email?.split('@')[0] || t('admin.users.unknown')}
                  </div>
                  <div className="text-xs text-[#19322F]/60 truncate">
                    {u.email}
                  </div>
                  <div className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded text-[#19322F]/50 ${
                    isFirst ? 'bg-white/50' : 'bg-gray-50 group-hover:bg-white/50'
                  } transition-colors`}>
                    ID: #{userId}
                  </div>
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                  isAdmin
                    ? 'bg-[#19322F] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isAdmin ? t('admin.users.role_admin') : t('admin.users.role_user')}
                </span>
                <div className="flex items-center text-xs text-[#19322F]/60">
                  <span className={`material-icons text-[14px] mr-1 ${
                    isAdmin ? 'text-[#006655]' : 'text-gray-400'
                  }`}>
                    {isAdmin ? 'check_circle' : 'schedule'}
                  </span>
                  {t('admin.users.active')}
                </div>
              </div>

              {/* Joined Date */}
              <div className="col-span-12 md:col-span-2 w-full">
                <div className="text-[10px] uppercase tracking-wider text-[#19322F]/40">{t('admin.users.joined')}</div>
                <div className="text-sm font-semibold text-[#19322F]">{joinedDate}</div>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end">
                <RoleSelector userId={u.id} currentRole={role} t={roleSelectorT} />
              </div>
            </div>
          )
        })}

        {(!users || users.length === 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <span className="material-icons text-4xl text-[#19322F]/20 mb-3 block">person_off</span>
            <p className="text-[#19322F]/50 text-sm">{t('admin.users.no_users')}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={totalUsers}
          usersPerPage={USERS_PER_PAGE}
          searchQuery={searchQuery}
          activeTab={activeTab}
          t={paginationT}
        />
      )}
    </div>
  )
}
