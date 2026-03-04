import Header from '@/components/layout/Header'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

const CATEGORY_COLOR: Record<string, string> = {
  '공지사항': '#5b0000', '오픈클래스': '#1a5b00',
  '이벤트': '#00305b', '협회소식': '#5b3800', '컨테스트': '#3b005b',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!news) notFound()

  // 조회수 증가
  await supabase
    .from('news')
    .update({ view_count: (news.view_count ?? 0) + 1 })
    .eq('id', id)

  return (
    <>
      <Header variant="light" />
      <main style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <div className="container" style={{ maxWidth: '800px', paddingTop: '40px', paddingBottom: '80px' }}>

          <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#666', marginBottom: '32px', fontWeight: 500 }}>
            <ChevronLeft size={16} />
            목록으로
          </Link>

          <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #eee' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: CATEGORY_COLOR[news.category] ?? '#333',
              color: '#fff', fontSize: '12px', fontWeight: 700,
              padding: '4px 12px', marginBottom: '16px',
            }}>
              {news.category}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#141414', lineHeight: 1.4, marginBottom: '12px' }}>
              {news.title}
            </h1>
            <p style={{ fontSize: '14px', color: '#aaa' }}>
              {formatDate(news.created_at)} · 조회 {(news.view_count ?? 0) + 1}
            </p>
          </div>

          <div style={{ fontSize: '16px', lineHeight: 2, color: '#444', whiteSpace: 'pre-line', backgroundColor: '#fff', padding: '40px', border: '1px solid #eee' }}>
            {news.content}
          </div>

          <div style={{ marginTop: '40px', padding: '30px', backgroundColor: 'var(--color-bg-cream)', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>참여 문의 및 신청</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/match" className="btn-primary">매칭 신청하기</Link>
              <Link href="/contact" className="btn-outline-dark">문의하기</Link>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link href="/news" style={{ fontSize: '14px', color: '#888', textDecoration: 'underline' }}>
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
