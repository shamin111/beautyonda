'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Star, SlidersHorizontal, X } from 'lucide-react'

const FIELDS = ['헤어', '메이크업', '네일', '피부관리', '웨딩', '업스타일', '퍼스널컬러', 'SMP', '붙임머리']
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '제주', '해외']
const METHODS = ['대면', '온라인', '방문 가능']
const CAREERS = ['1년 미만', '1~3년', '3~5년', '5년 이상']
const PRICES = ['5만원 이하', '5~10만원', '10~20만원', '20만원 이상']
const SORTS = [
  { value: 'recommended', label: '추천순' },
  { value: 'rating', label: '평점순' },
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
]

const GRADE_LABEL: Record<string, string> = {
  new: '🌱 NEW',
  standard: '⭐ 일반',
  pro: '⭐⭐ PRO',
  top: '🏆 TOP',
}

// 목업 데이터
const MOCK_INSTRUCTORS = [
  { id: '1', name: '이지연', role: '대표', company: '아이엠밸리', field: '헤어', region: '서울', career: '10년', price: '8만원~/1회', method: '대면', rating: 4.9, reviews: 32, match_count: 47, grade: 'top' },
  { id: '2', name: '박소연', role: '아티스트', company: '스타일리스트', field: '메이크업', region: '서울', career: '7년', price: '6만원~/1회', method: '대면', rating: 4.8, reviews: 24, match_count: 32, grade: 'pro' },
  { id: '3', name: '김민지', role: '강사', company: '뷰티아카데미', field: '네일', region: '서울', career: '5년', price: '4만원~/1회', method: '온라인', rating: 4.7, reviews: 18, match_count: 21, grade: 'pro' },
  { id: '4', name: '최현아', role: '원장', company: '뷰티스튜디오', field: '피부관리', region: '경기', career: '12년', price: '10만원~/1회', method: '대면', rating: 5.0, reviews: 41, match_count: 58, grade: 'top' },
  { id: '5', name: '정수빈', role: '아티스트', company: '프리랜서', field: '웨딩', region: '서울', career: '4년', price: '7만원~/1회', method: '대면', rating: 4.9, reviews: 12, match_count: 15, grade: 'standard' },
  { id: '6', name: '한지수', role: '컨설턴트', company: '컬러스튜디오', field: '퍼스널컬러', region: '서울', career: '6년', price: '5만원~/1회', method: '온라인', rating: 4.8, reviews: 20, match_count: 29, grade: 'pro' },
  { id: '7', name: '오미래', role: '강사', company: '헤어아카데미', field: '헤어', region: '부산', career: '8년', price: '6만원~/1회', method: '대면', rating: 4.6, reviews: 15, match_count: 19, grade: 'pro' },
  { id: '8', name: '서예진', role: '아티스트', company: '메이크업 by SEO', field: '메이크업', region: '경기', career: '3년', price: '4만원~/1회', method: '방문 가능', rating: 4.7, reviews: 8, match_count: 11, grade: 'standard' },
]

export default function InstructorListClient() {
  const [search, setSearch] = useState('')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [selectedCareer, setSelectedCareer] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [sort, setSort] = useState('recommended')
  const [mobileFilter, setMobileFilter] = useState(false)

  const toggleField = (f: string) => {
    setSelectedFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const resetFilters = () => {
    setSelectedFields([])
    setSelectedRegion('')
    setSelectedMethod('')
    setSelectedCareer('')
    setSelectedPrice('')
  }

  const filtered = MOCK_INSTRUCTORS.filter(i => {
    if (search && !i.name.includes(search) && !i.field.includes(search)) return false
    if (selectedFields.length && !selectedFields.includes(i.field)) return false
    if (selectedRegion && !i.region.includes(selectedRegion)) return false
    if (selectedMethod && i.method !== selectedMethod) return false
    return true
  })

  const FilterPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* 분야 */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px', color: '#141414' }}>📌 분야</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FIELDS.map(f => (
            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={selectedFields.includes(f)}
                onChange={() => toggleField(f)}
                style={{ accentColor: '#5b0000' }}
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {/* 지역 */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>📍 지역</p>
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#fff' }}
        >
          <option value="">전체 지역</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* 수업 방식 */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>📚 수업 방식</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {METHODS.map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="radio"
                name="method"
                value={m}
                checked={selectedMethod === m}
                onChange={() => setSelectedMethod(m === selectedMethod ? '' : m)}
                style={{ accentColor: '#5b0000' }}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* 경력 */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>🎓 경력</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CAREERS.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="radio"
                name="career"
                value={c}
                checked={selectedCareer === c}
                onChange={() => setSelectedCareer(c === selectedCareer ? '' : c)}
                style={{ accentColor: '#5b0000' }}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* 가격대 */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px' }}>💰 가격대</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRICES.map(p => (
            <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="radio"
                name="price"
                value={p}
                checked={selectedPrice === p}
                onChange={() => setSelectedPrice(p === selectedPrice ? '' : p)}
                style={{ accentColor: '#5b0000' }}
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      {/* 초기화 */}
      <button
        onClick={resetFilters}
        style={{ padding: '10px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}
      >
        필터 초기화
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '50px 0 40px' }}>
        <div className="container">
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px', color: '#141414' }}>강사 찾기</h1>
          <p style={{ fontSize: '16px', color: '#666' }}>원하는 분야의 전문 강사를 찾아보세요</p>

          {/* 검색바 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', maxWidth: '500px', backgroundColor: '#fff', padding: '0 16px', border: '1px solid #ddd' }}>
            <Search size={18} color="#999" />
            <input
              type="text"
              placeholder="강사 이름, 분야 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '14px 0', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          {/* Sidebar — 데스크톱 */}
          <aside
            style={{ width: '220px', flexShrink: 0, backgroundColor: '#fff', padding: '28px', border: '1px solid #eee' }}
            className="hidden md:block"
          >
            <FilterPanel />
          </aside>

          {/* Main */}
          <div style={{ flex: 1 }}>
            {/* 상단 정렬 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '15px', color: '#666' }}>
                총 <strong style={{ color: '#141414' }}>{filtered.length}명</strong>의 강사
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* 모바일 필터 버튼 */}
                <button
                  onClick={() => setMobileFilter(true)}
                  className="md:hidden"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
                >
                  <SlidersHorizontal size={14} />
                  필터
                </button>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#fff' }}
                >
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* 적용된 필터 태그 */}
            {(selectedFields.length > 0 || selectedRegion || selectedMethod) && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {selectedFields.map(f => (
                  <span key={f} onClick={() => toggleField(f)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', backgroundColor: '#5b0000', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                    {f} <X size={12} />
                  </span>
                ))}
                {selectedRegion && (
                  <span onClick={() => setSelectedRegion('')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', backgroundColor: '#5b0000', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                    {selectedRegion} <X size={12} />
                  </span>
                )}
                {selectedMethod && (
                  <span onClick={() => setSelectedMethod('')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', backgroundColor: '#5b0000', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                    {selectedMethod} <X size={12} />
                  </span>
                )}
              </div>
            )}

            {/* 강사 그리드 */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>검색 결과가 없습니다</p>
                <p>필터 조건을 변경해보세요</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {filtered.map(instructor => (
                  <Link key={instructor.id} href={`/instructors/${instructor.id}`} style={{ display: 'block' }}>
                    <div
                      className="instructor-card"
                      style={{ backgroundColor: '#fff', transition: 'box-shadow 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                    >
                      {/* 이미지 */}
                      <div className="instructor-img" style={{ backgroundColor: '#e8d5d5', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: instructor.grade === 'top' ? '#5b0000' : '#333', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
                          {GRADE_LABEL[instructor.grade]}
                        </span>
                        <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', padding: '2px 8px' }}>
                          {instructor.field}
                        </span>
                      </div>

                      {/* 정보 */}
                      <div className="instructor-info" style={{ padding: '16px', width: '100%' }}>
                        <h3 style={{ fontSize: '18px' }}>
                          {instructor.name}
                          <span className="role" style={{ fontSize: '14px' }}>{instructor.role}</span>
                        </h3>
                        <p className="desc" style={{ marginBottom: '10px' }}>{instructor.company}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                          <span>{instructor.region}</span>
                          <span>{instructor.method}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '13px' }}>
                          <span style={{ fontWeight: 700, color: '#5b0000', fontSize: '15px' }}>{instructor.price}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={12} fill="#5b0000" color="#5b0000" />
                            <strong>{instructor.rating}</strong>
                            <span style={{ color: '#aaa' }}>({instructor.reviews})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 필터 드로어 */}
      {mobileFilter && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <div onClick={() => setMobileFilter(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '280px', backgroundColor: '#fff', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '18px' }}>필터</h3>
              <button onClick={() => setMobileFilter(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFilter(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '20px', textAlign: 'center' }}
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
