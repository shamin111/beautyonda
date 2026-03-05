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

export async function createInstructor(payload: {
  name: string
  role: string
  company: string
  region: string
  fields: string[]
  career_years: number
  price_min: number
  lesson_method: string
  bio: string
  signature_style: string[]
  certifications: string[]
  instagram_url: string
  youtube_url: string
  profile_image: string
  portfolio_images: string[]
  grade: string
  is_approved: boolean
  is_active: boolean
}) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('instructors').insert({ ...payload, match_count: 0, rating: 0, review_count: 0 }).select().single()
  if (!error) revalidatePath('/admin/instructors')
  return { data, error }
}

export async function updateInstructor(id: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('instructors').update(updates).eq('id', id)
  if (error) {
    console.error('[updateInstructor] error:', error)
  } else {
    revalidatePath('/admin/instructors')
    revalidatePath('/')
  }
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
