'use client'

import { useState } from 'react'
import { CheckCircle, Upload } from 'lucide-react'

const FIELDS = ['헤어', '메이크업', '네일', '피부관리', '웨딩', '업스타일', '퍼스널컬러', 'SMP', '붙임머리', '두피케어']
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '해외 가능']
const METHODS = ['대면', '온라인', '방문 가능', '모두 가능']
const CAREER_YEARS = ['1년 미만', '1~3년', '3~5년', '5~10년', '10년 이상']

const BENEFITS = [
  { icon: '👥', title: '수강생 매칭 기회', desc: '조건에 맞는 수강생을 자동으로 연결해드립니다' },
  { icon: '📣', title: '프로필 노출', desc: '뷰티온다 플랫폼에 강사 프로필이 노출됩니다' },
  { icon: '🤝', title: '브랜드 협업', desc: '뷰티 브랜드와의 협업 기회를 제공합니다' },
  { icon: '🏆', title: '강사 등급 제도', desc: '활동에 따라 TOP 아티스트로 성장할 수 있습니다' },
]

interface Form {
  name: string
  phone: string
  region: string
  fields: string[]
  career: string
  method: string
  price_min: string
  price_max: string
  bio: string
  certifications: string
  instagram: string
  youtube: string
  agree: boolean
}

const INIT: Form = {
  name: '', phone: '', region: '',
  fields: [], career: '', method: '',
  price_min: '', price_max: '',
  bio: '', certifications: '',
  instagram: '', youtube: '',
  agree: false,
}

export default function RegisterClient() {
  const [form, setForm] = useState<Form>(INIT)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof Form, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const toggleField = (f: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.includes(f) ? prev.fields.filter(x => x !== f) : [...prev.fields, f],
    }))
  }

  const canSubmit = form.name && form.phone && form.region && form.fields.length > 0
    && form.career && form.method && form.price_min && form.bio && form.agree

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    // TODO: Supabase insert → 관리자 심사 대기
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>
          <CheckCircle size={72} color="#5b0000" style={{ margin: '0 auto 28px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>등록 신청 완료!</h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.9, marginBottom: '32px' }}>
            영업일 기준 3일 내 심사 결과를 연락드립니다.<br />
            승인 후 프로필이 플랫폼에 노출됩니다.
          </p>
          <a href="/" className="btn-primary" style={{ display: 'inline-block' }}>
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '70px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '14px' }}>뷰티온다 강사 등록</h1>
          <p style={{ fontSize: '18px', opacity: 0.85, lineHeight: 1.7 }}>
            현업 뷰티 전문가로 활동하고 있다면 지금 바로 등록하세요.<br />
            수강생 매칭, 교육 기회, 브랜드 협업까지 연결해드립니다.
          </p>
        </div>
      </div>

      {/* 혜택 */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ backgroundColor: '#fff', padding: '24px', border: '1px solid #e8d5c5' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{b.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', color: '#141414' }}>{b.title}</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 폼 */}
      <div className="container" style={{ maxWidth: '720px', paddingTop: '60px', paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>강사 등록 신청서</h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px' }}>
          <span style={{ color: '#5b0000' }}>*</span> 표시는 필수 항목입니다
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

          {/* 기본 정보 */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #141414' }}>기본 정보</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>이름 <span style={{ color: '#5b0000' }}>*</span></label>
                  <input className="form-input-box" placeholder="홍길동" value={form.name} onChange={e => set('name', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>연락처 <span style={{ color: '#5b0000' }}>*</span></label>
                  <input className="form-input-box" placeholder="010-0000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>활동 지역 <span style={{ color: '#5b0000' }}>*</span></label>
                <select value={form.region} onChange={e => set('region', e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '15px', backgroundColor: '#fff' }} required>
                  <option value="">지역 선택</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* 전문 분야 */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #141414' }}>전문 분야 <span style={{ color: '#5b0000', fontSize: '14px' }}>*</span></h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FIELDS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleField(f)}
                  style={{
                    padding: '10px 18px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: `1px solid ${form.fields.includes(f) ? '#5b0000' : '#ddd'}`,
                    backgroundColor: form.fields.includes(f) ? '#5b0000' : '#fff',
                    color: form.fields.includes(f) ? '#fff' : '#444',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* 강의 조건 */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #141414' }}>강의 조건</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>경력 <span style={{ color: '#5b0000' }}>*</span></label>
                  <select value={form.career} onChange={e => set('career', e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '15px', backgroundColor: '#fff' }} required>
                    <option value="">경력 선택</option>
                    {CAREER_YEARS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>수업 방식 <span style={{ color: '#5b0000' }}>*</span></label>
                  <select value={form.method} onChange={e => set('method', e.target.value)} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '15px', backgroundColor: '#fff' }} required>
                    <option value="">방식 선택</option>
                    {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>수강료 범위 <span style={{ color: '#5b0000' }}>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input-box" type="number" placeholder="최소 (예: 50000)" value={form.price_min} onChange={e => set('price_min', e.target.value)} style={{ border: '1px solid #ddd', flex: 1 }} required />
                  <span style={{ color: '#888', flexShrink: 0 }}>~</span>
                  <input className="form-input-box" type="number" placeholder="최대 (예: 150000)" value={form.price_max} onChange={e => set('price_max', e.target.value)} style={{ border: '1px solid #ddd', flex: 1 }} />
                  <span style={{ color: '#888', flexShrink: 0, fontSize: '14px' }}>원 / 1회</span>
                </div>
              </div>
            </div>
          </section>

          {/* 자기소개 */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #141414' }}>자기소개 및 포트폴리오</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>자기소개 <span style={{ color: '#5b0000' }}>*</span></label>
                <textarea
                  className="form-input-box"
                  placeholder="경력, 전문 분야, 강의 스타일 등을 소개해주세요 (100자 이상 권장)"
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  rows={5}
                  style={{ resize: 'none', width: '100%', border: '1px solid #ddd' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>보유 자격증 · 경력사항</label>
                <textarea
                  className="form-input-box"
                  placeholder="예) 미용사(헤어) 국가자격증, 헤어디자인 1급, OO방송 스타일리스트 (줄바꿈으로 구분)"
                  value={form.certifications}
                  onChange={e => set('certifications', e.target.value)}
                  rows={3}
                  style={{ resize: 'none', width: '100%', border: '1px solid #ddd' }}
                />
              </div>

              {/* 포트폴리오 업로드 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>포트폴리오 사진</label>
                <div style={{ border: '2px dashed #ddd', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fafafa' }}>
                  <Upload size={32} color="#ccc" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>이미지를 드래그하거나 클릭해서 업로드</p>
                  <p style={{ fontSize: '12px', color: '#bbb' }}>JPG, PNG / 최대 10장 / 각 5MB 이하</p>
                </div>
              </div>
            </div>
          </section>

          {/* SNS */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #141414' }}>SNS (선택)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="form-input-box" placeholder="인스타그램 URL (https://instagram.com/...)" value={form.instagram} onChange={e => set('instagram', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} />
              <input className="form-input-box" placeholder="유튜브 URL (https://youtube.com/...)" value={form.youtube} onChange={e => set('youtube', e.target.value)} style={{ border: '1px solid #ddd', width: '100%' }} />
            </div>
          </section>

          {/* 동의 + 제출 */}
          <section>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', color: '#444', lineHeight: 1.7 }}>
              <input type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} style={{ marginTop: '3px', accentColor: '#5b0000' }} />
              <span>
                개인정보 수집 및 이용에 동의하며, 입력한 정보가 사실임을 확인합니다.{' '}
                <span style={{ color: '#5b0000', fontWeight: 700 }}>(필수)</span>
                <br />
                <span style={{ fontSize: '13px', color: '#888' }}>허위 정보 등록 시 서비스 이용이 제한될 수 있습니다.</span>
              </span>
            </label>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center', fontSize: '17px', padding: '18px', opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              {loading ? '신청 중...' : '강사 등록 신청하기'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '14px' }}>
              영업일 기준 3일 내 심사 후 결과를 안내드립니다
            </p>
          </section>
        </form>
      </div>
    </div>
  )
}
