'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { MatchRequest } from '@/types'

const CATEGORIES = ['전체', '헤어', '메이크업', '네일', '피부관리', '웨딩/업스타일', '퍼스널컬러', 'SMP', '붙임머리', '기타']

const CATEGORY_COLOR: Record<string, string> = {
  '헤어': '#1a4b8c',
  '메이크업': '#8c1a5b',
  '네일': '#8c5b1a',
  '피부관리': '#1a8c4b',
  '웨딩/업스타일': '#5b1a8c',
  '퍼스널컬러': '#8c3d1a',
  'SMP': '#1a7a8c',
  '붙임머리': '#3d8c1a',
  '기타': '#555',
}

const LECTURE_TYPE_COLOR: Record<string, string> = {
  '출강강의': '#5b0000',
  '온라인강의': '#00305b',
  '클래스운영': '#1a5b00',
  '기타': '#555',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function MatchListClient({ items }: { items: MatchRequest[] }) {
  const [activeCategory, setActiveCategory] = useState('전체')

  const filtered = activeCategory === '전체'
    ? items
    : items.filter(m => m.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 페이지 헤더 */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '60px 0 50px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '10px' }}>섭외문의 · 정보</h1>
              <p style={{ fontSize: '16px', color: '#666' }}>섭외문의를 등록하시면 강사님 프로필/강의제안서를 무료로 받아보실 수 있습니다.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/match/new"
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}
              >
                섭외문의 무료등록
              </Link>
              <Link
                href="/instructors"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: 700,
                  backgroundColor: '#141414',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                강사 찾기 →
              </Link>
            </div>
          </div>
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
                padding: '12px 20px',
                fontSize: '14px',
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

        {/* 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
          className="match-grid"
        >
          {filtered.map(item => (
            <Link key={item.id} href={`/match/${item.id}`} style={{ display: 'block' }}>
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #eee',
                  padding: '24px',
                  height: '100%',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#5b0000'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#eee'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                {/* 카테고리 */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: CATEGORY_COLOR[item.category] ?? '#333',
                  marginBottom: '10px',
                  display: 'block',
                }}>
                  {item.category}
                </span>

                {/* 제목 */}
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#141414',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  minHeight: '46px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.title}
                </h3>

                {/* 정보 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
                    <span>📍</span>
                    <span>{item.location_si}{item.location_gu ? ` ${item.location_gu}` : ''}</span>
                  </div>
                  {item.preferred_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
                      <span>📅</span>
                      <span>{formatDate(item.preferred_date)}</span>
                    </div>
                  )}
                </div>

                {/* 강의 유형 */}
                <span style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: LECTURE_TYPE_COLOR[item.lecture_type] ?? '#333',
                  color: '#fff',
                }}>
                  {item.lecture_type}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
            <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>등록된 섭외문의가 없습니다</p>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>첫 번째 섭외문의를 등록해보세요</p>
            <Link href="/match/new" className="btn-primary" style={{ padding: '12px 28px' }}>
              섭외문의 등록하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
