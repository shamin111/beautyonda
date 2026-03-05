'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getBanners() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function createBanner(payload: {
  title: string; subtitle: string; image_url: string; link: string; sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('banners').insert({ ...payload, is_active: false, clicks: 0 })
  if (!error) revalidatePath('/admin/banners')
  return { error }
}

export async function updateBanner(id: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('banners').update(updates).eq('id', id)
  if (!error) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }
  return { error }
}

export async function deleteBanner(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('banners').delete().eq('id', id)
  if (!error) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }
  return { error }
}

export async function reorderBanners(ids: string[]) {
  const supabase = createAdminClient()
  await Promise.all(ids.map((id, i) =>
    supabase.from('banners').update({ sort_order: i + 1 }).eq('id', id)
  ))
  revalidatePath('/admin/banners')
  revalidatePath('/')
}
