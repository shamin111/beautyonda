'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { MessageCircle, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const INQUIRY_TYPES = [
  { value: 'match', label: '강사 매칭 문의' },
  { value: 'register', label: '강사 등록 문의' },
  { value: 'partner', label: '파트너·지사 문의' },
  { value: 'class', label: '오픈클래스 문의' },
  { value: 'etc', label: '기타' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', type: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { alert('개인정보 수집에 동의해주세요.'); return }
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contacts').insert({
      name: form.name,
      phone: form.phone,
      type: form.type,
      message: form.message,
      status: 'unread',
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <Header variant="light" />
      <main style={{ minHeight: '100vh' }}>

        {/* 헤더 */}
        <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '60px 0 50px' }}>
          <div className="container">
            <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '10px' }}>문의하기</h1>
            <p style={{ fontSize: '16px', color: '#666' }}>강사 등록, 매칭 상담, 파트너십 등 모든 문의를 받고 있습니다</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', alignItems: 'flex-start' }}>

            {/* 왼쪽 — 연락처 정보 */}
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '30px' }}>연락처</h2>
              {[
                { icon: Phone, label: '전화', value: '070-4680-1003' },
                { icon: Mail, label: '이메일', value: 'hello@beautyonda.com' },
                { icon: MapPin, label: '주소', value: '서울시 강남구 영동대로 602, 6층' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-bg-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="#5b0000" />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
                    <p style={{ fontSize: '15px', color: '#141414', fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}

              {/* 카카오 채널 */}
              <div style={{ marginTop: '36px', padding: '20px', backgroundColor: '#FEE500', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <MessageCircle size={22} color="#3A1D1D" />
                <div>
                  <p style={{ fontWeight: 800, fontSize: '15px', color: '#3A1D1D' }}>카카오톡 채널</p>
                  <p style={{ fontSize: '13px', color: '#3A1D1D', opacity: 0.7 }}>빠른 상담은 카카오로</p>
                </div>
              </div>

              {/* 운영시간 */}
              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#141414' }}>운영시간</p>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8 }}>
                  평일 10:00 ~ 18:00<br />
                  점심 12:00 ~ 13:00<br />
                  <span style={{ color: '#aaa' }}>주말·공휴일 휴무</span>
                </p>
              </div>
            </div>

            {/* 오른쪽 — 문의 폼 */}
            <div>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <CheckCircle size={56} color="#5b0000" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>문의가 접수되었습니다</h3>
                  <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
                    영업일 기준 1~2일 내로<br />
                    담당자가 연락드립니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '40px', border: '1px solid #eee' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '28px' }}>온라인 문의</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          이름 <span style={{ color: '#5b0000' }}>*</span>
                        </label>
                        <input className="form-input-box" placeholder="홍길동" value={form.name} onChange={e => set('name', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                          연락처 <span style={{ color: '#5b0000' }}>*</span>
                        </label>
                        <input className="form-input-box" placeholder="010-0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>문의 유형</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {INQUIRY_TYPES.map(t => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => set('type', t.value)}
                            style={{
                              padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                              border: `1px solid ${form.type === t.value ? '#5b0000' : '#ddd'}`,
                              backgroundColor: form.type === t.value ? '#5b0000' : '#fff',
                              color: form.type === t.value ? '#fff' : '#555',
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                        문의 내용 <span style={{ color: '#5b0000' }}>*</span>
                      </label>
                      <textarea
                        className="form-input-box"
                        placeholder="문의하실 내용을 자세히 작성해주세요"
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        rows={6}
                        style={{ resize: 'none', width: '100%', border: '1px solid #ddd' }}
                        required
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px', accentColor: '#5b0000' }} />
                      개인정보 수집 및 이용에 동의합니다 <span style={{ color: '#5b0000', fontWeight: 700 }}>(필수)</span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ width: '100%', textAlign: 'center', fontSize: '16px', padding: '16px' }}
                    >
                      {loading ? '전송 중...' : '문의 보내기'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
