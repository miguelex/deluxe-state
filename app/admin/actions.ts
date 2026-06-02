'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: 'user' | 'admin') {
  const supabase = await createClient()

  // Verify the current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Prevent admin from demoting themselves (optional safeguard)
  if (user.id === userId && newRole !== 'admin') {
     return { error: 'You cannot demote yourself' }
  }

  // Update the target user's role
  const { error } = await supabase
    .from('user_roles')
    .update({ role: newRole })
    .eq('user_id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
