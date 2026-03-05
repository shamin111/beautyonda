'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getInstructors() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('instructors')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateInstructor(id: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('instructors').update(updates).eq('id', id)
  if (!error) revalidatePath('/admin/instructors')
  return { error }
}

export async function toggleApprove(id: string, current: boolean) {
  return updateInstructor(id, { is_approved: !current })
}

export async function toggleActive(id: string, current: boolean) {
  return updateInstructor(id, { is_active: !current })
}

export async function deleteInstructor(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('instructors').delete().eq('id', id)
  if (!error) revalidatePath('/admin/instructors')
  return { error }
}
