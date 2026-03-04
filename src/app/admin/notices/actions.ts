'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getNotices() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createNotice(form: {
  category: string
  title: string
  content: string
  is_published: boolean
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').insert(form)
  if (error) throw error
  revalidatePath('/admin/notices')
  revalidatePath('/news')
}

export async function updateNotice(id: string, form: {
  category: string
  title: string
  content: string
  is_published: boolean
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/admin/notices')
  revalidatePath('/news')
}

export async function deleteNotice(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/notices')
  revalidatePath('/news')
}

export async function togglePublish(id: string, current: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('news')
    .update({ is_published: !current })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/notices')
  revalidatePath('/news')
}
