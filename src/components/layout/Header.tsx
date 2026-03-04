'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/instructors', label: '강사 찾기' },
  { href: '/match', label: '섭외문의' },
  { href: '/register', label: '강사 등록' },
  { href: '/about', label: '기업소개' },
  { href: '/news', label: '뉴스·이벤트' },
  { href: '/contact', label: '문의하기' },
]

interface HeaderProps {
  variant?: 'transparent' | 'light'
}

export default function Header({ variant = 'transparent' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isLight = variant === 'light' || scrolled

  return (
    <header
      style={{
        position: variant === 'transparent' ? (scrolled ? 'fixed' : 'absolute') : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: scrolled ? '15px 0' : '30px 0',
        backgroundColor: isLight ? 'rgba(255,255,255,0.97)' : 'transparent',
        borderBottom: variant === 'light' ? '1px solid #eee' : 'none',
        boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '1.4px',
              color: isLight ? 'var(--color-text-dark)' : '#fff',
            }}
          >
            BEAUTY ONDA
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isLight ? 'var(--color-text-dark)' : '#fff',
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '-0.5px',
                  opacity: pathname === link.href ? 1 : 0.85,
                  borderBottom: pathname === link.href ? '2px solid currentColor' : 'none',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="header-cta">
            {user ? (
              <>
                <Link
                  href="/mypage"
                  style={{
                    color: isLight ? 'var(--color-text-dark)' : '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    padding: '8px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    color: isLight ? 'var(--color-text-dark)' : '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/match/new"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    padding: '8px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  섭외문의 등록
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="header-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: isLight ? 'var(--color-text-dark)' : '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 200,
            }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 0',
                  color: 'var(--color-text-dark)',
                  fontWeight: 700,
                  fontSize: '16px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/mypage"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    marginTop: '16px',
                    padding: '14px 0',
                    color: 'var(--color-text-dark)',
                    fontWeight: 700,
                    fontSize: '16px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '16px',
                    padding: '14px',
                    backgroundColor: '#141414',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '16px',
                    textAlign: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/match/new"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    marginTop: '16px',
                    padding: '14px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '16px',
                    textAlign: 'center',
                  }}
                >
                  섭외문의 등록
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    marginTop: '8px',
                    padding: '14px',
                    backgroundColor: '#141414',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '16px',
                    textAlign: 'center',
                  }}
                >
                  로그인 / 회원가입
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
