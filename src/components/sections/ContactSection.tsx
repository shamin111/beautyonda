'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', role: '', phone: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { alert('개인정보 수집에 동의해주세요.'); return }
    setLoading(true)
    // TODO: Supabase insert 또는 EmailJS 연동
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        padding: '120px 0',
        backgroundColor: '#111',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* 배경 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 0 }} />

      <div
        className="container"
        style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '60px', flexWrap: 'wrap' }}
      >
        {/* Left */}
        <div style={{ flex: '0 0 300px' }}>
          <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '16px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Contact Us
          </span>
          <h2 style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
            문의하기
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, opacity: 0.7 }}>
            강사 등록, 매칭 상담, 파트너십 등<br />
            모든 문의를 받고 있습니다.
          </p>
        </div>

        {/* Right — Form */}
        <div style={{ flex: 1, minWidth: '320px', maxWidth: '600px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>✅ 접수 완료</p>
              <p style={{ opacity: 0.7 }}>1~2일 내로 담당자가 연락드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <input
                  className="form-input-box"
                  placeholder="이름"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className="form-input-box"
                  placeholder="직책/분야 (예: 헤어 강사)"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  className="form-input-box"
                  placeholder="연락처"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  className="form-input-box"
                  placeholder="문의 내용"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  style={{ resize: 'none', width: '100%' }}
                  required
                />
              </div>

              {/* 동의 + 제출 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '14px', opacity: 0.8 }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px' }} />
                  개인정보 수집 및 이용에 동의합니다
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  {loading ? '전송 중...' : '문의 보내기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
