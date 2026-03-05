import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import InstructorDetailClient from './InstructorDetailClient'
import { createClient } from '@/lib/supabase/server'
import type { Instructor, Review } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('instructors').select('name, fields').eq('id', id).single()
  return {
    title: data ? `${data.name} 강사 프로필 | 뷰티온다` : '강사 프로필 | 뷰티온다',
  }
}

export default async function InstructorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: instructor } = await supabase
    .from('instructors')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .eq('is_approved', true)
    .single()

  if (!instructor) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('instructor_id', id)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Header variant="light" />
      <InstructorDetailClient
        instructor={instructor as Instructor}
        reviews={(reviews ?? []) as Review[]}
      />
    </>
  )
}
