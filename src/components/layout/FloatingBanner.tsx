'use client'

import Link from 'next/link'
import { MessageCircle, Calendar } from 'lucide-react'

export default function FloatingBanner() {
  return (
    <div className="floating-banner">
      {/* 카카오톡 채널 */}
      <a
        href="https://pf.kakao.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn kakao"
        title="카카오톡 채널"
        style={{ backgroundColor: '#FEE500', color: '#3A1D1D' }}
      >
        <MessageCircle size={24} />
      </a>

      {/* 매칭 신청 */}
      <Link
        href="/match"
        className="floating-btn match"
        title="매칭 신청"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
      >
        <Calendar size={24} />
      </Link>
    </div>
  )
}
