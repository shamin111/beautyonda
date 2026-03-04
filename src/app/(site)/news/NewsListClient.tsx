'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { News } from '@/types'

const CATEGORIES = ['전체', '공지사항', '오픈클래스', '이벤트', '협회소식', '컨테스트']

const CATEGORY_COLOR: Record<string, string> = {
  '공지사항': '#5b0000',
  '오픈클래스': '#1a5b00',
  '이벤트': '#00305b',
  '협회소식': '#5b3800',
  '컨테스트': '#3b005b',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

function getSummary(content: string) {
  return content.replace(/\n/g, ' ').slice(0, 100) + (content.length > 100 ? '...' : '')
}

export default function NewsListClient({ initialData }: { initialData: News[] }) {
  const [activeCategory, setActiveCategory] = useState('전체')

  const filtered = activeCategory === '전체'
    ? initialData
    : initialData.filter(n => n.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 페이지 헤더 */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '60px 0 50px' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '10px' }}>뉴스 · 이벤트</h1>
          <p style={{ fontSize: '16px', color: '#666' }}>뷰티온다의 최신 소식과 교육 일정을 확인하세요</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* 카테고리 탭 */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #eee', marginBottom: '40px', overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: activeCategory === cat ? '#5b0000' : '#888',
                borderBottom: activeCategory === cat ? '2px solid #5b0000' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 뉴스 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map((news, i) => (
            <Link key={news.id} href={`/news/${news.id}`} style={{ display: 'block' }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '28px 32px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  transition: 'background 0.2s',
                  borderLeft: i === 0 ? '4px solid #5b0000' : '4px solid transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff9f5' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff' }}
              >
                <span style={{ fontSize: '13px', color: '#ccc', fontFamily: 'var(--font-eng-bold)', minWidth: '30px', paddingTop: '4px' }}>
                  {String(filtered.length - i).padStart(2, '0')}
                </span>
                <span style={{
                  flexShrink: 0,
                  backgroundColor: CATEGORY_COLOR[news.category] ?? '#333',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  marginTop: '2px',
                }}>
                  {news.category}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#141414', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {news.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getSummary(news.content)}
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right', fontSize: '13px', color: '#aaa' }}>
                  <p>{formatDate(news.created_at)}</p>
                  <p style={{ marginTop: '4px' }}>조회 {news.view_count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
            <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>게시물이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
