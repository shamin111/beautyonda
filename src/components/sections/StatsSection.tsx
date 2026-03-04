'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 150, suffix: '+', label: '등록 강사 수' },
  { value: 320, suffix: '+', label: '매칭 완료 건수' },
  { value: 98, suffix: '%', label: '교육·레슨 만족도' },
]

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 20)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [target, duration, active])

  return count
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, 2000, active)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div className="stat-number" style={{ display: 'flex', alignItems: 'flex-start' }}>
        {count}
        <span style={{ fontSize: '45px', marginTop: '10px' }}>{suffix}</span>
      </div>
      <p style={{ fontSize: '18px', fontWeight: 700, color: '#141414', marginTop: '10px' }}>{label}</p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section style={{ backgroundColor: 'var(--color-bg-cream)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
          {STATS.map(s => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
