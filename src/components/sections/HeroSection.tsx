'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DEFAULT_SLIDES = [
  {
    title: '고수가 중수를,\n중수가 하수를 끌어올린다',
    subtitle: '현업 경력자가 다음 단계를 이끄는 뷰티 클래스',
    image_url: '',
    link_url: '',
  },
  {
    title: '뷰티의 모든 분야\n선생님 찾기는 뷰티온다!',
    subtitle: '헤어부터 메이크업, 네일, 스킨케어까지 전문 강사를 만나보세요',
    image_url: '',
    link_url: '',
  },
  {
    title: '실전·중급·고급이\n자연스럽게 이어지는 교육',
    subtitle: '단계별 실력 향상 — 교육·레슨·취업까지 이어지는 매칭 플랫폼',
    image_url: '',
    link_url: '',
  },
]

type BannerSlide = {
  title: string
  subtitle: string
  image_url?: string | null
  link_url?: string | null
}

export default function HeroSection({ slides }: { slides?: BannerSlide[] }) {
  const SLIDES = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (SLIDES.length <= 1) return
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [SLIDES.length])

  const slide = SLIDES[current]

  return (
    <section className="hero-section">
      {/* 배경 */}
      {slide.image_url ? (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slide.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2d0000 0%, #5b0000 40%, #1a0a0a 100%)', zIndex: 0 }} />
      )}
      {/* 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />

      {/* 콘텐츠 */}
      <div className="container hero-content">
        {/* Brand */}
        <p style={{ fontFamily: 'var(--font-pretendard)', fontWeight: 800, fontSize: '22px', letterSpacing: '4px', marginBottom: '8vh', opacity: 0.7, textTransform: 'uppercase' }}>
          Beauty ONDA
        </p>

        {/* Slide Content */}
        <div style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <h1 className="hero-slogan" style={{ whiteSpace: 'pre-line', marginBottom: '28px', color: '#fff' }}>
            {slide.title}
          </h1>
          <p className="hero-subtitle" style={{ marginBottom: '48px', maxWidth: '600px' }}>
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div className="hero-cta">
            <Link href="/match" className="btn-primary">
              강사 매칭 신청하기
            </Link>
            <Link href="/instructors" className="btn-outline-white">
              강사 둘러보기
            </Link>
          </div>
        </div>

        {/* Slide Dots */}
        {SLIDES.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '60px' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? '32px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
