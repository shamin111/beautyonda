'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getContacts() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function markAsRead(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('contacts').update({ is_read: true }).eq('id', id)
  if (!error) revalidatePath('/admin/contacts')
  return { error }
}

export async function deleteContact(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (!error) revalidatePath('/admin/contacts')
  return { error }
}
