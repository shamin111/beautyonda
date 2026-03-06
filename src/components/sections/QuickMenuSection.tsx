import Link from 'next/link'
import { Search, UserPlus, Building2, CalendarDays } from 'lucide-react'

const MENUS = [
  { icon: Search, label: '강사 매칭', sub: '맞춤 강사 찾기', href: '/match', bg: '#5b0000', color: '#fff' },
  { icon: UserPlus, label: '강사 등록', sub: '강사로 활동하기', href: '/register', bg: '#fff5ed', color: '#5b0000' },
  { icon: Building2, label: '파트너 모집', sub: '지사·파트너 신청', href: '/partner', bg: '#fff5ed', color: '#5b0000' },
  { icon: CalendarDays, label: '교육 일정', sub: '오픈클래스·특강', href: '/news', bg: '#fff5ed', color: '#5b0000' },
]

export default function QuickMenuSection() {
  return (
    <section style={{ backgroundColor: '#fff', padding: '0' }}>
      <div className="quick-menu-grid">
        {MENUS.map(({ icon: Icon, label, sub, href, bg, color }) => (
          <Link
            key={href}
            href={href}
            style={{
              backgroundColor: bg,
              color,
              padding: '36px 30px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'opacity 0.2s',
              borderRight: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Icon size={28} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '13px', opacity: 0.7 }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
