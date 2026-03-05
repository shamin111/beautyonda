'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

const FIELDS = ['전체', '헤어', '메이크업', '네일', '피부관리', '웨딩', '퍼스널컬러']

type InstructorItem = {
  id: string
  name: string
  role: string
  company: string
  fields: string[]
  region: string
  rating: number
  match_count: number
  grade: string
  profile_image?: string
}

const GRADE_LABEL: Record<string, string> = {
  new: '🌱 NEW',
  standard: '⭐ 일반',
  pro: '⭐⭐ PRO',
  top: '🏆 TOP',
}

export default function InstructorsSection({ initialData }: { initialData: InstructorItem[] }) {
  const [activeField, setActiveField] = useState('전체')

  const filtered = activeField === '전체'
    ? initialData
    : initialData.filter(i => i.fields?.includes(activeField))

  return (
    <section id="instructors" style={{ padding: '100px 0', backgroundColor: '#fff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 className="section-title-center" style={{ marginBottom: '12px' }}>추천 강사</h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.6 }}>
            검증된 현업 아티스트와 함께 한 단계 성장하세요
          </p>
        </div>

        {/* Field Tabs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
          {FIELDS.map(f => (
            <button
              key={f}
              onClick={() => setActiveField(f)}
              className={`filter-chip ${activeField === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '30px',
            marginBottom: '50px',
          }}
        >
          {filtered.map(instructor => (
            <Link key={instructor.id} href={`/instructors/${instructor.id}`} style={{ display: 'block' }}>
              <div className="instructor-card">
                {/* 이미지 */}
                <div
                  className="instructor-img"
                  style={{ backgroundColor: '#e8d5d5', position: 'relative' }}
                >
                  {/* 등급 배지 */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: instructor.grade === 'top' ? '#5b0000' : '#333',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                    }}
                  >
                    {GRADE_LABEL[instructor.grade]}
                  </span>
                </div>

                {/* 정보 */}
                <div className="instructor-info" style={{ width: '100%' }}>
                  <h3>
                    {instructor.name}
                    <span className="role">{instructor.role}</span>
                  </h3>
                  <p className="desc">{instructor.company}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', color: '#666' }}>
                    <Star size={14} fill="#5b0000" color="#5b0000" />
                    <span style={{ fontWeight: 700, color: '#141414' }}>{instructor.rating}</span>
                    <span>·</span>
                    <span>{instructor.region}</span>
                    <span>·</span>
                    <span>매칭 {instructor.match_count}건</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/instructors" className="btn-outline-dark">
            강사 전체 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
