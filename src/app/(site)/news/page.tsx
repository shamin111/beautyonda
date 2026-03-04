import Header from '@/components/layout/Header'
import NewsListClient from './NewsListClient'
import { createClient } from '@/lib/supabase/server'
import type { News } from '@/types'

export const metadata = {
  title: '뉴스·이벤트',
  description: '뷰티온다의 최신 소식과 오픈클래스·특강 일정을 확인하세요.',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const news: News[] = data ?? []

  return (
    <>
      <Header variant="light" />
      <NewsListClient initialData={news} />
    </>
  )
}
