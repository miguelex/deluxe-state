'use client'

import { useState } from 'react'
import { updateUserRole } from '../actions'

export default function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true)
    const newRole = e.target.value as 'user' | 'admin'
    const result = await updateUserRole(userId, newRole)
    if (result.error) {
      alert(result.error)
    }
    setIsUpdating(false)
  }

  return (
    <select
      value={currentRole}
      onChange={handleRoleChange}
      disabled={isUpdating}
      className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 disabled:opacity-50"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )
}
