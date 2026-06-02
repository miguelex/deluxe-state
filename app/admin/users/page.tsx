import { createClient } from '@/lib/supabase/server'
import RoleSelector from './RoleSelector'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      created_at,
      user_roles (
        role
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-500">Error loading users: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Users</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {users?.map((u) => {
                // Ensure we handle arrays or objects safely depending on relation return type
                const role = Array.isArray(u.user_roles) 
                  ? u.user_roles[0]?.role || 'user'
                  : u.user_roles?.role || 'user';

                return (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-medium">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <RoleSelector userId={u.id} currentRole={role} />
                    </td>
                  </tr>
                )
              })}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
