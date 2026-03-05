'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Clock, Award, ChevronLeft, Instagram, Youtube } from 'lucide-react'
import type { Instructor, Review } from '@/types'

const GRADE_MAP: Record<string, { label: string; bg: string }> = {
  top:      { label: '🏆 TOP 아티스트', bg: '#5b0000' },
  pro:      { label: '⭐⭐ PRO',         bg: '#333' },
  standard: { label: '⭐ 일반',          bg: '#555' },
  new:      { label: '🌱 NEW',           bg: '#777' },
}

const METHOD_LABEL: Record<string, string> = {
  offline: '대면',
  online:  '온라인',
  both:    '대면+온라인',
}

const TABS = ['소개', '포트폴리오', '강의 과목', '리뷰']

interface Props {
  instructor: Instructor
  reviews: Review[]
}

export default function InstructorDetailClient({ instructor, reviews }: Props) {
  const [activeTab, setActiveTab] = useState('소개')

  const grade = GRADE_MAP[instructor.grade] ?? { label: instructor.grade, bg: '#777' }

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
  }))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '16px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <Link href="/instructors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
            <ChevronLeft size={16} /> 강사 목록
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── 왼쪽 본문 ── */}
          <div style={{ flex: 1, minWidth: '300px' }}>

            {/* 프로필 헤더 */}
            <div style={{ display: 'flex', gap: '28px', marginBottom: '36px', flexWrap: 'wrap' }}>
              <div style={{ width: '140px', height: '140px', flexShrink: 0, position: 'relative', backgroundColor: '#e8d5d5', backgroundImage: instructor.profile_image ? `url(${instructor.profile_image})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: grade.bg, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px' }}>
                  {grade.label}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px', color: '#141414' }}>
                  {instructor.name}
                  <span style={{ fontSize: '18px', fontWeight: 400, color: '#666', marginLeft: '8px' }}>{instructor.role}</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#555', marginBottom: '14px' }}>{instructor.company}</p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {instructor.fields?.map(f => (
                    <span key={f} style={{ padding: '4px 12px', backgroundColor: 'var(--color-bg-cream)', fontSize: '13px', fontWeight: 600, color: '#5b0000', border: '1px solid #e8d5c5' }}>
                      {f}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={14} fill="#5b0000" color="#5b0000" />
                    <strong style={{ color: '#141414', fontSize: '16px' }}>{instructor.rating?.toFixed(1) ?? '-'}</strong>
                    <span>({instructor.review_count ?? 0}개)</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={14} color="#5b0000" /> {instructor.region}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} color="#5b0000" /> 경력 {instructor.career_years}년
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Award size={14} color="#5b0000" /> 매칭 {instructor.match_count ?? 0}건
                  </span>
                </div>

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
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '14px 24px', fontSize: '15px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab ? '#5b0000' : '#888', borderBottom: activeTab === tab ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px', transition: 'all 0.2s' }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* 소개 탭 */}
            {activeTab === '소개' && (
              <div>
                {instructor.bio && (
                  <section style={{ marginBottom: '36px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#141414' }}>자기소개</h3>
                    <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#444', whiteSpace: 'pre-line' }}>{instructor.bio}</p>
                  </section>
                )}

                {instructor.signature_style?.length > 0 && (
                  <section style={{ marginBottom: '36px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#141414' }}>시그니처 스타일</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {instructor.signature_style.map(s => (
                        <span key={s} className="filter-chip active">{s}</span>
                      ))}
                    </div>
                  </section>
                )}

                {instructor.certifications?.length > 0 && (
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
                )}

                {!instructor.bio && !instructor.signature_style?.length && !instructor.certifications?.length && (
                  <p style={{ color: '#aaa', fontSize: '15px' }}>아직 소개 정보가 등록되지 않았습니다.</p>
                )}
              </div>
            )}

            {/* 포트폴리오 탭 */}
            {activeTab === '포트폴리오' && (
              <div>
                {instructor.portfolio_images?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {instructor.portfolio_images.map((img, i) => (
                      <div key={i} style={{ aspectRatio: '1/1', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#eee' }} />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                    <p style={{ fontSize: '40px', marginBottom: '16px' }}>🖼️</p>
                    <p style={{ fontSize: '16px' }}>등록된 포트폴리오가 없습니다</p>
                  </div>
                )}
              </div>
            )}

            {/* 강의 과목 탭 */}
            {activeTab === '강의 과목' && (
              <div>
                <div style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: '#141414' }}>
                        {instructor.fields?.join(', ')} 레슨
                      </h4>
                      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
                        {instructor.bio ? instructor.bio.split('\n')[0] : '강사에게 직접 문의해주세요.'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '17px', fontWeight: 800, color: '#5b0000', marginBottom: '4px' }}>
                        {instructor.price_min ? `${instructor.price_min.toLocaleString()}원~/1회` : '가격 문의'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#888' }}>{METHOD_LABEL[instructor.lesson_method] ?? instructor.lesson_method}</p>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#aaa', marginTop: '16px', textAlign: 'center' }}>
                  상세 커리큘럼은 매칭 신청 후 강사와 직접 협의하세요
                </p>
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === '리뷰' && (
              <div>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', padding: '24px', backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '56px', fontWeight: 800, color: '#5b0000', lineHeight: 1 }}>{instructor.rating?.toFixed(1) ?? '-'}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '8px 0' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(instructor.rating ?? 0) ? '#5b0000' : '#ddd'} color={i < Math.round(instructor.rating ?? 0) ? '#5b0000' : '#ddd'} />
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: '#888' }}>{reviews.length}개 리뷰</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    {ratingDistribution.map(({ star, count }) => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ width: '30px', textAlign: 'right', color: '#666' }}>{star}점</span>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#eee', overflow: 'hidden' }}>
                          <div style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%', height: '100%', backgroundColor: '#5b0000' }} />
                        </div>
                        <span style={{ width: '20px', color: '#888' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                    <p style={{ fontSize: '40px', marginBottom: '16px' }}>⭐</p>
                    <p style={{ fontSize: '16px' }}>아직 등록된 리뷰가 없습니다</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #eee', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e8d5d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#5b0000' }}>
                            {review.author_name?.[0] ?? '?'}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '15px' }}>{review.author_name}</p>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? '#5b0000' : '#ddd'} color={i < review.rating ? '#5b0000' : '#ddd'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '13px', color: '#aaa' }}>{review.created_at?.slice(0, 10)}</span>
                      </div>
                      <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7 }}>{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── 오른쪽 예약 박스 ── */}
          <div style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '28px' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>수강료</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#5b0000', marginBottom: '20px' }}>
                {instructor.price_min ? `${instructor.price_min.toLocaleString()}원~` : '가격 문의'}
                <span style={{ fontSize: '15px', fontWeight: 400, color: '#888' }}> /1회</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>수업 방식</span>
                  <span style={{ fontWeight: 600 }}>{METHOD_LABEL[instructor.lesson_method] ?? instructor.lesson_method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>응답률</span>
                  <span style={{ fontWeight: 600, color: '#1a7a1a' }}>{instructor.response_rate ?? '-'}%</span>
                </div>
              </div>

              <Link href={`/match/new?instructor=${instructor.id}`} className="btn-primary"
                style={{ display: 'block', textAlign: 'center', width: '100%', marginBottom: '10px' }}>
                매칭 신청하기
              </Link>
              <Link href="/contact"
                style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, color: '#555' }}>
                1:1 문의
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
