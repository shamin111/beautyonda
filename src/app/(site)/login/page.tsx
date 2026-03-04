'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/layout/Header'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    setLoading(false)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push(next)
      router.refresh()
    }
  }

  const handleKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  return (
    <>
      <Header variant="light" />
      <main style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* 로고 */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '1px', color: '#141414' }}>
              BEAUTY ONDA
            </Link>
            <p style={{ fontSize: '15px', color: '#888', marginTop: '8px' }}>로그인하고 서비스를 이용하세요</p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px' }}>

            {/* 에러 */}
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', fontSize: '14px', marginBottom: '20px', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            {/* 이메일 폼 */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#555' }}>이메일</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#555' }}>비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '15px', fontSize: '16px', textAlign: 'center', marginTop: '4px' }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }} />
              <span style={{ fontSize: '13px', color: '#aaa' }}>또는</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }} />
            </div>

            {/* 카카오 로그인 */}
            <button
              onClick={handleKakao}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                fontWeight: 700,
                backgroundColor: '#FEE500',
                color: '#191919',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '20px' }}>💬</span>
              카카오로 로그인
            </button>
          </div>

          {/* 회원가입 링크 */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888' }}>
            아직 회원이 아니신가요?{' '}
            <Link href="/signup" style={{ color: '#5b0000', fontWeight: 700, textDecoration: 'none' }}>
              회원가입
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
