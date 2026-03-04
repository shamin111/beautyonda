'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { CheckCircle } from 'lucide-react'

const BENEFITS = [
  { icon: '🗺️', title: '지역 우선권', desc: '담당 지역 내 강사 매칭 요청을 우선적으로 배정받습니다.' },
  { icon: '📣', title: '교육 운영 권한', desc: '뷰티온다 오픈클래스·특강을 지역 내에서 직접 운영할 수 있습니다.' },
  { icon: '💼', title: '브랜드 사용권', desc: '뷰티온다 공식 파트너 명칭과 로고 사용이 가능합니다.' },
  { icon: '📊', title: '수익 쉐어', desc: '담당 지역 매칭 성사 건에 대한 수익 일부를 배분받습니다.' },
  { icon: '🤝', title: '본사 지원', desc: '마케팅 자료, 강사 DB, 운영 노하우를 본사에서 지원합니다.' },
  { icon: '🏆', title: '네트워크', desc: '전국 파트너 네트워크와 연결되어 협력 기회가 확대됩니다.' },
]

const STEPS = [
  { step: '01', title: '지원서 작성', desc: '아래 폼을 작성하여 파트너 신청' },
  { step: '02', title: '서류 검토', desc: '본사 담당자가 신청서 검토 (3~5일)' },
  { step: '03', title: '면담 진행', desc: '화상 또는 대면 면담 진행' },
  { step: '04', title: '파트너 계약', desc: '계약 체결 후 파트너 활동 시작' },
]

export default function PartnerPage() {
  const [form, setForm] = useState({ name: '', org: '', region: '', phone: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { alert('개인정보 수집에 동의해주세요.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <Header variant="light" />
      <main style={{ minHeight: '100vh' }}>

        {/* 히어로 */}
        <section style={{ backgroundColor: '#111', color: '#fff', padding: '100px 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>Partner Program</p>
            <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
              뷰티온다와 함께<br />지역을 이끄세요
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.8, opacity: 0.8, maxWidth: '560px' }}>
              전국 지사·파트너를 모집합니다.<br />
              담당 지역에서 강사 매칭과 교육 운영을 직접 주도하세요.
            </p>
          </div>
        </section>

        {/* 혜택 */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--color-bg-cream)' }}>
          <div className="container">
            <h2 className="section-title-center" style={{ textAlign: 'center', marginBottom: '12px' }}>파트너 혜택</h2>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', marginBottom: '60px' }}>
              뷰티온다 공식 파트너가 되면 받을 수 있는 혜택입니다
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {BENEFITS.map(b => (
                <div key={b.title} style={{ backgroundColor: '#fff', padding: '32px', border: '1px solid #e8d5c5' }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>{b.icon}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '10px', color: '#141414' }}>{b.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 프로세스 */}
        <section style={{ padding: '100px 0', backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '60px' }}>파트너 신청 절차</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
              {STEPS.map(s => (
                <div key={s.step} style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-eng-bold)', fontSize: '40px', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>{s.step}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 신청 폼 */}
        <section style={{ padding: '100px 0', backgroundColor: '#fafafa' }}>
          <div className="container" style={{ maxWidth: '680px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>파트너 지원하기</h2>
            <p style={{ textAlign: 'center', fontSize: '15px', color: '#888', marginBottom: '50px' }}>담당자가 검토 후 연락드립니다</p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                <CheckCircle size={56} color="#5b0000" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>지원서가 접수되었습니다</h3>
                <p style={{ color: '#666', lineHeight: 1.8 }}>영업일 기준 3~5일 내로 연락드립니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '40px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>담당자 이름 <span style={{ color: '#5b0000' }}>*</span></label>
                    <input className="form-input-box" placeholder="홍길동" value={form.name} onChange={e => set('name', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>연락처 <span style={{ color: '#5b0000' }}>*</span></label>
                    <input className="form-input-box" placeholder="010-0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>소속 기관·업체명</label>
                  <input className="form-input-box" placeholder="예) OO 뷰티아카데미" value={form.org} onChange={e => set('org', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>희망 담당 지역 <span style={{ color: '#5b0000' }}>*</span></label>
                  <input className="form-input-box" placeholder="예) 경기 수원, 인천 전역" value={form.region} onChange={e => set('region', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>지원 동기 및 역량</label>
                  <textarea
                    className="form-input-box"
                    placeholder="파트너 활동 동기, 보유 네트워크, 관련 경험 등을 자유롭게 작성해주세요"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    rows={5}
                    style={{ resize: 'none', width: '100%', border: '1px solid #ddd' }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '2px', accentColor: '#5b0000' }} />
                  개인정보 수집 및 이용에 동의합니다 <span style={{ color: '#5b0000', fontWeight: 700 }}>(필수)</span>
                </label>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', textAlign: 'center', padding: '16px', fontSize: '16px' }}>
                  {loading ? '제출 중...' : '파트너 지원하기'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
