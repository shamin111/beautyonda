'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/instructors', label: '강사 관리', icon: '👤' },
  { href: '/admin/matches', label: '매칭 관리', icon: '🤝' },
  { href: '/admin/notices', label: '공지·뉴스', icon: '📢' },
  { href: '/admin/contacts', label: '문의 관리', icon: '💬' },
  { href: '/admin/banners', label: '배너 관리', icon: '🖼️' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside style={{ width: '220px', backgroundColor: '#1a1a1a', color: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '1px' }}>BEAUTY ONDA</p>
        <p style={{ fontSize: '11px', opacity: 0.4, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin</p>
      </div>
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {NAV.map(item => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 20px',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                transition: 'all 0.15s',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>← 사이트로 돌아가기</Link>
      </div>
    </aside>
  )
}
