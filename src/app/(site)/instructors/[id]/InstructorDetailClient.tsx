'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Award, ChevronLeft, Instagram, Youtube } from 'lucide-react'

// 목업 데이터 (Supabase 연결 전)
const MOCK_DETAIL = {
  id: '1',
  name: '이지연',
  role: '대표',
  company: '주식회사 아이엠밸리',
  fields: ['헤어', '업스타일', '웨딩'],
  region: '서울 강남구',
  career_years: 10,
  lesson_method: '대면',
  price_min: 80000,
  price_max: 150000,
  bio: `현업 10년차 헤어 아티스트로, 다양한 방송 촬영 및 웨딩 현장에서 활동해왔습니다.\n실전 경험을 바탕으로 수강생 개개인에 맞는 맞춤형 레슨을 제공합니다.\n초보자부터 자격증 준비생, 현직자 심화 교육까지 모두 가능합니다.`,
  signature_style: ['내추럴 웨이브', '업스타일', '웨딩 헤어', '방송 스타일'],
  certifications: ['미용사(헤어) 국가자격증', '헤어디자인 1급', 'SMP 전문 자격증'],
  grade: 'top',
  rating: 4.9,
  review_count: 32,
  match_count: 47,
  response_rate: 98,
  instagram_url: 'https://instagram.com',
  youtube_url: 'https://youtube.com',
  reviews: [
    { id: '1', author: '김수진', rating: 5, content: '정말 친절하고 실력도 최고예요! 덕분에 자격증 합격했습니다.', date: '2025.02.10' },
    { id: '2', author: '박지현', rating: 5, content: '현업 노하우를 아낌없이 가르쳐 주셔서 많이 성장했어요.', date: '2025.01.22' },
    { id: '3', author: '이미래', rating: 4, content: '체계적인 커리큘럼으로 단기간에 실력이 늘었습니다.', date: '2025.01.05' },
  ],
}

const GRADE_MAP: Record<string, { label: string; bg: string }> = {
  top: { label: '🏆 TOP 아티스트', bg: '#5b0000' },
  pro: { label: '⭐⭐ PRO', bg: '#333' },
  standard: { label: '⭐ 일반', bg: '#555' },
  new: { label: '🌱 NEW', bg: '#777' },
}

const TABS = ['소개', '포트폴리오', '강의 과목', '리뷰']

export default function InstructorDetailClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState('소개')
  const instructor = MOCK_DETAIL // TODO: Supabase에서 id로 fetch

  const grade = GRADE_MAP[instructor.grade]
  const priceText = `${instructor.price_min.toLocaleString()}원 ~ ${instructor.price_max.toLocaleString()}원 / 1회`

  const ratingDistribution = [
    { star: 5, count: 26 },
    { star: 4, count: 4 },
    { star: 3, count: 2 },
    { star: 2, count: 0 },
    { star: 1, count: 0 },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '16px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <Link href="/instructors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
            <ChevronLeft size={16} />
            강사 목록
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── 왼쪽 본문 ── */}
          <div style={{ flex: 1, minWidth: '300px' }}>

            {/* 프로필 헤더 */}
            <div style={{ display: 'flex', gap: '28px', marginBottom: '36px', flexWrap: 'wrap' }}>
              {/* 프로필 사진 */}
              <div style={{ width: '140px', height: '140px', flexShrink: 0, backgroundColor: '#e8d5d5', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: grade.bg, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px' }}>
                  {grade.label}
                </span>
              </div>

              {/* 기본 정보 */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px', color: '#141414' }}>
                  {instructor.name}
                  <span style={{ fontSize: '18px', fontWeight: 400, color: '#666', marginLeft: '8px' }}>{instructor.role}</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#555', marginBottom: '14px' }}>{instructor.company}</p>

                {/* 분야 태그 */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {instructor.fields.map(f => (
                    <span key={f} style={{ padding: '4px 12px', backgroundColor: 'var(--color-bg-cream)', fontSize: '13px', fontWeight: 600, color: '#5b0000', border: '1px solid #e8d5c5' }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* 메타 정보 */}
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={14} fill="#5b0000" color="#5b0000" />
                    <strong style={{ color: '#141414', fontSize: '16px' }}>{instructor.rating}</strong>
                    <span>({instructor.review_count}개)</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#5b0000" />
                    {instructor.region}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} color="#5b0000" />
                    경력 {instructor.career_years}년
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Award size={14} color="#5b0000" />
                    매칭 {instructor.match_count}건
                  </span>
                </div>

                {/* SNS */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                  {instructor.instagram_url && (
                    <a href={instructor.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: '#5b0000' }}>
                      <Instagram size={20} />
                    </a>
                  )}
                  {instructor.youtube_url && (
                    <a href={instructor.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: '#5b0000' }}>
                      <Youtube size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '36px' }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 700,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: activeTab === tab ? '#5b0000' : '#888',
                    borderBottom: activeTab === tab ? '2px solid #5b0000' : '2px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            {activeTab === '소개' && (
              <div>
                <section style={{ marginBottom: '36px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#141414' }}>자기소개</h3>
                  <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#444', whiteSpace: 'pre-line' }}>{instructor.bio}</p>
                </section>

                <section style={{ marginBottom: '36px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#141414' }}>시그니처 스타일</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {instructor.signature_style.map(s => (
                      <span key={s} className="filter-chip active">{s}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#141414' }}>자격증 · 경력</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {instructor.certifications.map(c => (
                      <li key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#444' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b0000', flexShrink: 0 }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {activeTab === '포트폴리오' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '30px' }}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '1/1', backgroundColor: `hsl(${350 - i * 10}, 30%, ${85 - i * 2}%)` }} />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#999', textAlign: 'center' }}>
                  포트폴리오 이미지는 강사 등록 후 업로드됩니다
                </p>
              </div>
            )}

            {activeTab === '강의 과목' && (
              <div>
                {[
                  { subject: '헤어 기초 레슨', desc: '기초 컷팅, 블로우 드라이부터 시작하는 입문 과정', price: '8만원/1회', method: '대면' },
                  { subject: '업스타일 클래스', desc: '웨딩·방송용 업스타일 기법 집중 과정', price: '12만원/1회', method: '대면' },
                  { subject: '자격증 대비 과정', desc: '미용사(헤어) 국가자격증 필기·실기 대비', price: '10만원/1회', method: '대면/온라인' },
                ].map(course => (
                  <div key={course.subject} style={{ padding: '24px', backgroundColor: '#fff', marginBottom: '12px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#141414' }}>{course.subject}</h4>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>{course.desc}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '17px', fontWeight: 800, color: '#5b0000', marginBottom: '4px' }}>{course.price}</p>
                        <p style={{ fontSize: '13px', color: '#888' }}>{course.method}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === '리뷰' && (
              <div>
                {/* 평점 요약 */}
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', padding: '24px', backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', fontWeight: 800, color: '#5b0000', lineHeight: 1 }}>{instructor.rating}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '8px 0' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(instructor.rating) ? '#5b0000' : '#ddd'} color={i < Math.round(instructor.rating) ? '#5b0000' : '#ddd'} />
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: '#888' }}>{instructor.review_count}개 리뷰</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    {ratingDistribution.map(({ star, count }) => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ width: '30px', textAlign: 'right', color: '#666' }}>{star}점</span>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#eee', overflow: 'hidden' }}>
                          <div style={{ width: `${(count / instructor.review_count) * 100}%`, height: '100%', backgroundColor: '#5b0000' }} />
                        </div>
                        <span style={{ width: '20px', color: '#888' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리뷰 목록 */}
                {instructor.reviews.map(review => (
                  <div key={review.id} style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8d5d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#5b0000' }}>
                          {review.author[0]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '15px' }}>{review.author}</p>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? '#5b0000' : '#ddd'} color={i < review.rating ? '#5b0000' : '#ddd'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '13px', color: '#aaa' }}>{review.date}</span>
                    </div>
                    <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7 }}>{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 오른쪽 예약 박스 ── */}
          <div style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '28px' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>수강료</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#5b0000', marginBottom: '20px' }}>
                {instructor.price_min.toLocaleString()}원~
                <span style={{ fontSize: '15px', fontWeight: 400, color: '#888' }}> /1회</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>수업 방식</span>
                  <span style={{ fontWeight: 600 }}>{instructor.lesson_method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>응답률</span>
                  <span style={{ fontWeight: 600, color: '#1a7a1a' }}>{instructor.response_rate}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>평균 응답</span>
                  <span style={{ fontWeight: 600 }}>2시간 이내</span>
                </div>
              </div>

              <Link
                href={`/match?instructor=${instructor.id}`}
                className="btn-primary"
                style={{ display: 'block', textAlign: 'center', width: '100%', marginBottom: '10px' }}
              >
                매칭 신청하기
              </Link>
              <Link
                href="/contact"
                style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, color: '#555' }}
              >
                1:1 문의
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
