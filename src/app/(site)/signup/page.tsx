'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/layout/Header'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'student' as 'student' | 'instructor',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, role: form.role },
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 가입된 이메일입니다.')
      } else {
        setError(`오류: ${error.message}`)
      }
    } else {
      setDone(true)
    }
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

  if (done) {
    return (
      <>
        <Header variant="light" />
        <main style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '60px 40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✉️</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>이메일을 확인해주세요</h2>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>
                <strong>{form.email}</strong>로 인증 메일을 보냈습니다.<br />
                메일의 링크를 클릭하면 가입이 완료됩니다.
              </p>
              <Link
                href="/login"
                className="btn-primary"
                style={{ display: 'inline-block', marginTop: '32px', padding: '14px 40px', fontSize: '15px' }}
              >
                로그인하러 가기
              </Link>
            </div>
          </div>
        </main>
      </>
    )
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
            <p style={{ fontSize: '15px', color: '#888', marginTop: '8px' }}>회원가입으로 서비스를 시작하세요</p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px' }}>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', fontSize: '14px', marginBottom: '20px', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#555' }}>이름</label>
                <input
                  type="text"
                  placeholder="이름 입력"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
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
                  placeholder="6자 이상"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#555' }}>비밀번호 확인</label>
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={form.passwordConfirm}
                  onChange={e => setForm(f => ({ ...f, passwordConfirm: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>

              {/* 역할 선택 */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#555' }}>가입 유형</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(['student', 'instructor'] as const).map(r => (
                    <label
                      key={r}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 16px',
                        border: `2px solid ${form.role === r ? '#5b0000' : '#ddd'}`,
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: form.role === r ? '#5b0000' : '#666',
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={form.role === r}
                        onChange={() => setForm(f => ({ ...f, role: r }))}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        width: '18px', height: '18px',
                        border: `2px solid ${form.role === r ? '#5b0000' : '#ccc'}`,
                        borderRadius: '50%',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {form.role === r && <span style={{ width: '8px', height: '8px', backgroundColor: '#5b0000', borderRadius: '50%' }} />}
                      </span>
                      {r === 'student' ? '수강생' : '강사'}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '15px', fontSize: '16px', textAlign: 'center', marginTop: '4px' }}
              >
                {loading ? '처리 중...' : '회원가입'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" style={{ color: '#5b0000', fontWeight: 700, textDecoration: 'none' }}>
              로그인
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
