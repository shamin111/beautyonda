import Header from '@/components/layout/Header'
import InstructorListClient from './InstructorListClient'
import { createClient } from '@/lib/supabase/server'
import type { Instructor } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: '강사 찾기',
  description: '뷰티온다에 등록된 검증된 강사를 분야, 지역, 가격대별로 찾아보세요.',
}

export default async function InstructorsPage() {
  const supabase = await createClient()

  const { data: instructors } = await supabase
    .from('instructors')
    .select('id, name, role, company, fields, region, career_years, lesson_method, price_min, price_max, grade, rating, review_count, match_count, profile_image, is_active, is_approved')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('match_count', { ascending: false })

  return (
    <>
      <Header variant="light" />
      <InstructorListClient instructors={(instructors ?? []) as Instructor[]} />
    </>
  )
}
