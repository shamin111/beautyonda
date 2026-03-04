'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

const STEPS = ['기본 정보', '레슨 조건', '상세 요청', '완료']

const FIELDS = ['헤어', '메이크업', '네일', '피부관리', '웨딩', '업스타일', '퍼스널컬러', 'SMP', '붙임머리']
const REGIONS_SI = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const LEVELS = [
  { value: 'beginner', label: '입문', desc: '처음 시작해요' },
  { value: 'elementary', label: '초급', desc: '기초는 알아요' },
  { value: 'intermediate', label: '중급', desc: '어느 정도 해봤어요' },
  { value: 'advanced', label: '고급', desc: '심화를 원해요' },
]
const METHODS = [
  { value: 'offline', label: '대면', desc: '직접 만나서' },
  { value: 'online', label: '온라인', desc: '비대면 수업' },
  { value: 'both', label: '상관없음', desc: '둘 다 가능' },
]
const PURPOSES = [
  { value: 'hobby', label: '취미·관심' },
  { value: 'certificate', label: '자격증 취득' },
  { value: 'job', label: '취업·이직' },
  { value: 'private', label: '개인 레슨' },
  { value: 'startup', label: '창업 준비' },
]
const PRICES = [
  { value: '0-50000', label: '5만원 이하' },
  { value: '50000-100000', label: '5~10만원' },
  { value: '100000-200000', label: '10~20만원' },
  { value: '200000+', label: '20만원 이상' },
  { value: 'any', label: '협의 가능' },
]

interface FormData {
  // Step 1
  name: string
  phone: string
  region: string
  // Step 2
  fields: string[]
  method: string
  level: string
  price: string
  // Step 3
  purposes: string[]
  preferred_date: string
  message: string
  agree: boolean
}

const INIT: FormData = {
  name: '', phone: '', region: '',
  fields: [], method: '', level: '', price: '',
  purposes: [], preferred_date: '', message: '', agree: false,
}

export default function MatchRequestClient() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const toggleArray = (key: 'fields' | 'purposes', val: string) => {
    setForm(f => {
      const arr = f[key] as string[]
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.phone.trim() && form.region
    if (step === 1) return form.fields.length > 0 && form.method && form.level && form.price
    if (step === 2) return form.purposes.length > 0 && form.agree
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    // TODO: Supabase insert
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    setStep(3)
  }

  const ChipBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 18px',
        fontSize: '14px',
        fontWeight: 600,
        border: `1px solid ${active ? '#5b0000' : '#ddd'}`,
        backgroundColor: active ? '#5b0000' : '#fff',
        color: active ? '#fff' : '#444',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 페이지 헤더 */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '50px 0 40px' }}>
        <div className="container">
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>강사 매칭 신청</h1>
          <p style={{ fontSize: '16px', color: '#666' }}>조건을 입력하면 담당자가 맞춤 강사를 연결해드립니다</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '720px', paddingTop: '50px', paddingBottom: '80px' }}>
        {/* Step Indicator */}
        <div className="step-bar" style={{ marginBottom: '50px' }}>
          {STEPS.map((label, i) => (
            <div key={label} className={`step-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <span style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-eng-bold)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {label}
            </div>
          ))}
        </div>

        {/* ── Step 0: 기본 정보 ── */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '30px' }}>기본 정보를 입력해주세요</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#141414' }}>
                  이름 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <input
                  className="form-input-box"
                  placeholder="이름을 입력해주세요"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  style={{ border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                  연락처 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <input
                  className="form-input-box"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  style={{ border: '1px solid #ddd', width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                  희망 지역 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <select
                  value={form.region}
                  onChange={e => set('region', e.target.value)}
                  style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '15px', backgroundColor: '#fff' }}
                >
                  <option value="">지역을 선택해주세요</option>
                  {REGIONS_SI.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: 레슨 조건 ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '30px' }}>원하는 레슨 조건을 선택해주세요</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                  분야 <span style={{ color: '#5b0000' }}>*</span>
                  <span style={{ fontWeight: 400, color: '#888', marginLeft: '6px' }}>(복수 선택 가능)</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FIELDS.map(f => (
                    <ChipBtn key={f} label={f} active={form.fields.includes(f)} onClick={() => toggleArray('fields', f)} />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                  수업 방식 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {METHODS.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => set('method', m.value)}
                      style={{
                        padding: '16px 24px',
                        border: `2px solid ${form.method === m.value ? '#5b0000' : '#eee'}`,
                        backgroundColor: form.method === m.value ? '#fff5ed' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        minWidth: '120px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <p style={{ fontWeight: 800, fontSize: '16px', color: form.method === m.value ? '#5b0000' : '#141414', marginBottom: '4px' }}>{m.label}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                  현재 수준 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {LEVELS.map(l => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => set('level', l.value)}
                      style={{
                        padding: '16px 24px',
                        border: `2px solid ${form.level === l.value ? '#5b0000' : '#eee'}`,
                        backgroundColor: form.level === l.value ? '#fff5ed' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        minWidth: '110px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <p style={{ fontWeight: 800, fontSize: '16px', color: form.level === l.value ? '#5b0000' : '#141414', marginBottom: '4px' }}>{l.label}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                  예산 범위 <span style={{ color: '#5b0000' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRICES.map(p => (
                    <ChipBtn key={p.value} label={p.label} active={form.price === p.value} onClick={() => set('price', p.value)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: 상세 요청 ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '30px' }}>조금 더 알려주세요</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                  수업 목적 <span style={{ color: '#5b0000' }}>*</span>
                  <span style={{ fontWeight: 400, color: '#888', marginLeft: '6px' }}>(복수 선택 가능)</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PURPOSES.map(p => (
                    <ChipBtn key={p.value} label={p.label} active={form.purposes.includes(p.value)} onClick={() => toggleArray('purposes', p.value)} />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>희망 일정</label>
                <input
                  type="date"
                  className="form-input-box"
                  value={form.preferred_date}
                  onChange={e => set('preferred_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ border: '1px solid #ddd', width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>추가 요청사항</label>
                <textarea
                  className="form-input-box"
                  placeholder="강사에게 전달하고 싶은 내용이나 특이사항을 적어주세요"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  rows={4}
                  style={{ resize: 'none', width: '100%', border: '1px solid #ddd' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={e => set('agree', e.target.checked)}
                  style={{ marginTop: '2px', accentColor: '#5b0000' }}
                />
                <span>
                  개인정보 수집 및 이용에 동의합니다.{' '}
                  <span style={{ color: '#5b0000', fontWeight: 600 }}>(필수)</span>
                  <br />
                  <span style={{ fontSize: '13px', color: '#888' }}>수집된 정보는 강사 매칭 목적으로만 사용되며, 3개월 후 자동 삭제됩니다.</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 3: 완료 ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <CheckCircle size={64} color="#5b0000" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>신청이 완료되었습니다!</h2>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '40px' }}>
              담당자가 영업일 기준 1~2일 내로 연락드립니다.<br />
              카카오톡 또는 전화로 연락 예정입니다.
            </p>
            <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '24px', marginBottom: '40px', textAlign: 'left' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '16px' }}>신청 요약</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: '#888', minWidth: '70px' }}>이름</span>
                  <span style={{ fontWeight: 600 }}>{form.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: '#888', minWidth: '70px' }}>연락처</span>
                  <span style={{ fontWeight: 600 }}>{form.phone}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: '#888', minWidth: '70px' }}>분야</span>
                  <span style={{ fontWeight: 600 }}>{form.fields.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ color: '#888', minWidth: '70px' }}>지역</span>
                  <span style={{ fontWeight: 600 }}>{form.region}</span>
                </div>
              </div>
            </div>
            <a href="/" className="btn-outline-dark" style={{ display: 'inline-block' }}>
              홈으로 돌아가기
            </a>
          </div>
        )}

        {/* 하단 버튼 */}
        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              style={{
                padding: '14px 32px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.4 : 1,
              }}
            >
              이전
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary"
                style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canNext() || loading}
                className="btn-primary"
                style={{ opacity: canNext() ? 1 : 0.4 }}
              >
                {loading ? '신청 중...' : '매칭 신청하기'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
