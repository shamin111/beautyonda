'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getMatchRequests() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('match_requests')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function updateMatchStatus(id: string, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('match_requests').update({ status }).eq('id', id)
  if (!error) revalidatePath('/admin/matches')
  return { error }
}

export async function deleteMatchRequest(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('match_requests').delete().eq('id', id)
  if (!error) revalidatePath('/admin/matches')
  return { error }
}
