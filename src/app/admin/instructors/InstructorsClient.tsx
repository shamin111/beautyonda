'use client'

import { useState, useTransition, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  createInstructor, updateInstructor,
  toggleApprove, toggleActive, deleteInstructor,
} from './actions'

export type Instructor = {
  id: string
  name: string
  role: string
  company: string
  region: string
  fields: string[]
  career_years: number
  price_min: number
  lesson_method: string
  bio: string
  signature_style: string[]
  certifications: string[]
  instagram_url: string
  youtube_url: string
  profile_image: string
  portfolio_images: string[]
  grade: string
  is_approved: boolean
  is_active: boolean
  rating: number
  match_count: number
  created_at: string
}

type FormState = {
  name: string; role: string; company: string; region: string
  fields: string[]; career_years: string; price_min: string
  lesson_method: string; bio: string; signature_style_input: string
  signature_style: string[]; certifications_input: string; certifications: string[]
  instagram_url: string; youtube_url: string; grade: string
  profile_image: string; portfolio_images: string[]
}

const FIELDS_LIST = ['헤어', '메이크업', '네일', '피부관리', '웨딩', 'SMP', '속눈썹', '반영구']
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '제주', '기타']
const METHODS = [
  { value: 'offline', label: '대면 출강' },
  { value: 'online', label: '온라인' },
  { value: 'both', label: '대면+온라인' },
]

const GRADES = [
  { value: 'new', label: '🌱 NEW' },
  { value: 'standard', label: '⭐ 일반' },
  { value: 'pro', label: '⭐⭐ PRO' },
  { value: 'top', label: '🏆 TOP' },
]

const EMPTY_FORM: FormState = {
  name: '', role: '', company: '', region: '서울',
  fields: [], career_years: '', price_min: '',
  lesson_method: 'offline', bio: '', signature_style_input: '',
  signature_style: [], certifications_input: '', certifications: [],
  instagram_url: '', youtube_url: '', grade: 'new',
  profile_image: '', portfolio_images: [],
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: '심사 대기', color: '#92400e', bg: '#fef3c7' },
  approved: { label: '승인', color: '#065f46', bg: '#d1fae5' },
  rejected: { label: '반려', color: '#991b1b', bg: '#fee2e2' },
}

function getStatus(i: Instructor) {
  if (i.is_approved) return 'approved'
  if (i.is_active) return 'pending'
  return 'rejected'
}

async function uploadImage(file: File, bucket: string): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error || !data) return null
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return publicUrl
}

/* ── 프로필 이미지 업로드 컴포넌트 ─────────────────────────── */
function ProfileImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const url = await uploadImage(file, 'instructors')
    setUploading(false)
    if (url) onChange(url)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div onClick={() => !uploading && fileRef.current?.click()}
        style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fafafa', flexShrink: 0 }}>
        {uploading
          ? <span style={{ fontSize: '12px', color: '#aaa' }}>업로드 중</span>
          : value
            ? <img src={value} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ textAlign: 'center', color: '#bbb' }}><div style={{ fontSize: '24px' }}>📷</div><div style={{ fontSize: '11px' }}>클릭 업로드</div></div>
        }
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
      <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.8, paddingTop: '8px' }}>
        <p style={{ fontWeight: 700, color: '#555', marginBottom: '4px' }}>프로필 사진</p>
        <p>· 권장: 400×400px 이상</p>
        <p>· JPG, PNG, WebP</p>
        {value && <button onClick={() => onChange('')} style={{ marginTop: '4px', fontSize: '12px', color: '#c00', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>사진 제거</button>}
      </div>
    </div>
  )
}

/* ── 포트폴리오 이미지 업로드 컴포넌트 ──────────────────────── */
function PortfolioUpload({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return
    setUploading(true)
    const urls = await Promise.all(files.map(f => uploadImage(f, 'instructors')))
    setUploading(false)
    onChange([...images, ...urls.filter(Boolean) as string[]])
    e.target.value = ''
  }

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx))

  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: '#555' }}>
        포트폴리오 이미지
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        {images.map((url, i) => (
          <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #ddd' }} />
            <button onClick={() => remove(i)}
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', lineHeight: '18px', padding: 0 }}>
              ×
            </button>
          </div>
        ))}
        <div onClick={() => !uploading && fileRef.current?.click()}
          style={{ width: '80px', height: '80px', border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'default' : 'pointer', backgroundColor: '#fafafa', flexShrink: 0 }}>
          {uploading ? <span style={{ fontSize: '10px', color: '#aaa' }}>업로드 중</span> : <span style={{ fontSize: '24px', color: '#ccc' }}>+</span>}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />
      <p style={{ fontSize: '12px', color: '#aaa' }}>클릭하여 여러 장 선택 가능 · JPG, PNG, WebP</p>
    </div>
  )
}

/* ── 강의 과목 태그 입력 ──────────────────────────────────── */
function TagInput({ tags, onAdd, onRemove, inputVal, onInputChange }: {
  tags: string[]; onAdd: () => void; onRemove: (i: number) => void
  inputVal: string; onInputChange: (v: string) => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {tags.map((t, i) => (
          <span key={i} style={{ padding: '4px 10px', backgroundColor: '#f5f0ec', fontSize: '12px', color: '#5b0000', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {t}
            <button onClick={() => onRemove(i)} style={{ border: 'none', background: 'none', color: '#5b0000', cursor: 'pointer', fontSize: '12px', padding: 0, lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', fontSize: '13px', outline: 'none' }}
          placeholder="예) 기초 커트 (Enter로 추가)"
          value={inputVal}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
        />
        <button onClick={onAdd} style={{ padding: '8px 14px', border: '1px solid #5b0000', backgroundColor: '#fff', color: '#5b0000', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}>추가</button>
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ──────────────────────────────────────── */
export default function InstructorsClient({ initialData }: { initialData: Instructor[] }) {
  const [data, setData] = useState<Instructor[]>(initialData)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Instructor | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()

  const sf = (k: keyof FormState, v: FormState[keyof FormState]) => setForm(f => ({ ...f, [k]: v }))

  const filtered = filter === 'all' ? data : data.filter(d => getStatus(d) === filter)

  const openDetail = (row: Instructor) => {
    setSelected(row)
    setEditMode(false)
    setShowForm(false)
    setForm({
      name: row.name, role: row.role ?? '', company: row.company ?? '',
      region: row.region,
      fields: row.fields ?? [], career_years: String(row.career_years ?? ''),
      price_min: String(row.price_min ?? ''), lesson_method: row.lesson_method ?? 'offline',
      bio: row.bio ?? '', signature_style_input: '',
      signature_style: row.signature_style ?? [],
      certifications_input: '', certifications: row.certifications ?? [],
      instagram_url: row.instagram_url ?? '', youtube_url: row.youtube_url ?? '',
      grade: row.grade ?? 'new',
      profile_image: row.profile_image ?? '', portfolio_images: row.portfolio_images ?? [],
    })
  }

  const toggleField = (field: string) => {
    setForm(f => ({
      ...f,
      fields: f.fields.includes(field) ? f.fields.filter(x => x !== field) : [...f.fields, field],
    }))
  }

  const addTag = () => {
    const val = form.signature_style_input.trim(); if (!val) return
    setForm(f => ({ ...f, signature_style: [...f.signature_style, val], signature_style_input: '' }))
  }

  const removeTag = (i: number) => setForm(f => ({ ...f, signature_style: f.signature_style.filter((_, idx) => idx !== i) }))

  const addCert = () => {
    const val = form.certifications_input.trim(); if (!val) return
    setForm(f => ({ ...f, certifications: [...f.certifications, val], certifications_input: '' }))
  }

  const removeCert = (i: number) => setForm(f => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }))

  const handleAdd = () => {
    if (!form.name) return alert('이름은 필수입니다.')
    startTransition(async () => {
      const { data: created, error } = await createInstructor({
        name: form.name, role: form.role, company: form.company,
        region: form.region,
        fields: form.fields, career_years: Number(form.career_years) || 0,
        price_min: Number(form.price_min) || 0,
        lesson_method: form.lesson_method, bio: form.bio,
        signature_style: form.signature_style,
        certifications: form.certifications,
        instagram_url: form.instagram_url, youtube_url: form.youtube_url,
        profile_image: form.profile_image, portfolio_images: form.portfolio_images,
        grade: form.grade,
        is_approved: true, is_active: true,
      })
      if (created) {
        setData(prev => [created as unknown as Instructor, ...prev])
        setForm(EMPTY_FORM)
        setShowForm(false)
      } else if (error) alert('등록 실패: ' + error.message)
    })
  }

  const handleSaveEdit = () => {
    if (!selected) return
    const updates = {
      name: form.name, role: form.role, company: form.company,
      region: form.region,
      fields: form.fields, career_years: Number(form.career_years) || 0,
      price_min: Number(form.price_min) || 0,
      lesson_method: form.lesson_method, bio: form.bio,
      signature_style: form.signature_style,
      certifications: form.certifications,
      instagram_url: form.instagram_url, youtube_url: form.youtube_url,
      profile_image: form.profile_image, portfolio_images: form.portfolio_images,
      grade: form.grade,
    }
    const updated = { ...selected, ...updates }
    setData(prev => prev.map(d => d.id === selected.id ? updated : d))
    setSelected(updated)
    setEditMode(false)
    startTransition(async () => {
      const { error } = await updateInstructor(selected.id, updates)
      if (error) alert('저장 실패: ' + error.message)
    })
  }

  const handleApprove = (id: string, current: boolean) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, is_approved: !current, is_active: true } : d))
    setSelected(prev => prev?.id === id ? { ...prev, is_approved: !current, is_active: true } : prev)
    startTransition(async () => { await toggleApprove(id, current) })
  }

  const handleActive = (id: string, current: boolean) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, is_active: !current } : d))
    setSelected(prev => prev?.id === id ? { ...prev, is_active: !current } : prev)
    startTransition(async () => { await toggleActive(id, current) })
  }

  const handleDelete = (id: string) => {
    if (!confirm('강사를 삭제하시겠습니까? 되돌릴 수 없습니다.')) return
    setData(prev => prev.filter(d => d.id !== id))
    setSelected(null)
    startTransition(async () => { await deleteInstructor(id) })
  }

  const inputS: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }
  const labelS: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 440px' : '1fr', gap: '24px', alignItems: 'flex-start' }}>

      {/* ── 좌측 목록 ──────────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>강사 관리</h1>
            <p style={{ fontSize: '14px', color: '#888' }}>등록 신청 심사 및 강사 직접 등록</p>
          </div>
          <button onClick={() => { setShowForm(v => !v); setSelected(null) }}
            className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>
            + 강사 직접 등록
          </button>
        </div>

        {/* ── 직접 등록 폼 ── */}
        {showForm && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', color: '#5b0000' }}>강사 직접 등록</h2>
            <ProfileImageUpload value={form.profile_image} onChange={url => sf('profile_image', url)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div><label style={labelS}>이름 *</label><input style={inputS} placeholder="홍길동" value={form.name} onChange={e => sf('name', e.target.value)} /></div>
              <div><label style={labelS}>직책/역할</label><input style={inputS} placeholder="예) 헤어 아티스트, 원장" value={form.role} onChange={e => sf('role', e.target.value)} /></div>
              <div><label style={labelS}>소속 기관</label><input style={inputS} placeholder="예) 뷰티아카데미, 프리랜서" value={form.company} onChange={e => sf('company', e.target.value)} /></div>
              <div>
                <label style={labelS}>지역</label>
                <select style={inputS} value={form.region} onChange={e => sf('region', e.target.value)}>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>등급</label>
                <select style={inputS} value={form.grade} onChange={e => sf('grade', e.target.value)}>
                  {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>경력 (년)</label>
                <input style={inputS} type="number" placeholder="5" value={form.career_years} onChange={e => sf('career_years', e.target.value)} />
              </div>
              <div>
                <label style={labelS}>강의 시작 금액 (원)</label>
                <input style={inputS} type="number" placeholder="60000" value={form.price_min} onChange={e => sf('price_min', e.target.value)} />
              </div>
              <div>
                <label style={labelS}>수업 방식</label>
                <select style={inputS} value={form.lesson_method} onChange={e => sf('lesson_method', e.target.value)}>
                  {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>
            {/* 분야 다중 선택 */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelS}>분야 (복수 선택)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {FIELDS_LIST.map(f => (
                  <button key={f} onClick={() => toggleField(f)}
                    style={{ padding: '6px 14px', fontSize: '13px', border: `1px solid ${form.fields.includes(f) ? '#5b0000' : '#ddd'}`, backgroundColor: form.fields.includes(f) ? '#5b0000' : '#fff', color: form.fields.includes(f) ? '#fff' : '#555', cursor: 'pointer', fontWeight: 600 }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelS}>강사 소개</label>
              <textarea style={{ ...inputS, resize: 'vertical' }} rows={3} placeholder="강사 소개 문구를 입력하세요" value={form.bio} onChange={e => sf('bio', e.target.value)} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelS}>강의 과목</label>
              <TagInput tags={form.signature_style} onAdd={addTag} onRemove={removeTag} inputVal={form.signature_style_input} onInputChange={v => sf('signature_style_input', v)} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelS}>자격증 · 경력</label>
              <TagInput tags={form.certifications} onAdd={addCert} onRemove={removeCert} inputVal={form.certifications_input} onInputChange={v => sf('certifications_input', v)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div><label style={labelS}>인스타그램 URL</label><input style={inputS} placeholder="https://instagram.com/..." value={form.instagram_url} onChange={e => sf('instagram_url', e.target.value)} /></div>
              <div><label style={labelS}>유튜브 URL</label><input style={inputS} placeholder="https://youtube.com/..." value={form.youtube_url} onChange={e => sf('youtube_url', e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <PortfolioUpload images={form.portfolio_images} onChange={imgs => sf('portfolio_images', imgs)} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleAdd} disabled={isPending} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>등록 완료</button>
            </div>
          </div>
        )}

        {/* ── 필터 탭 ── */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
          {[['all', '전체'], ['pending', '심사 대기'], ['approved', '승인됨'], ['rejected', '반려됨']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: filter === val ? '#5b0000' : '#888', borderBottom: filter === val ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px' }}>
              {label}
              <span style={{ marginLeft: '6px', fontSize: '12px', color: filter === val ? '#5b0000' : '#bbb' }}>
                {val === 'all' ? data.length : data.filter(d => getStatus(d) === val).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── 테이블 ── */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #eee' }}>
                {['사진', '이름', '분야', '지역', '경력', '방식', '상태', '등록일'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const s = STATUS_LABEL[getStatus(row)]
                const isSelected = selected?.id === row.id
                return (
                  <tr key={row.id} onClick={() => openDetail(row)}
                    style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', backgroundColor: isSelected ? '#fff9f5' : '#fff' }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#fafafa' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = isSelected ? '#fff9f5' : '#fff' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0e8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {row.profile_image ? <img src={row.profile_image} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}><div style={{ fontWeight: 700 }}>{row.name}</div></td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(row.fields ?? []).slice(0, 2).map(f => (
                          <span key={f} style={{ padding: '2px 7px', fontSize: '11px', backgroundColor: '#f5f0ec', color: '#5b0000', fontWeight: 600 }}>{f}</span>
                        ))}
                        {(row.fields ?? []).length > 2 && <span style={{ fontSize: '11px', color: '#aaa' }}>+{row.fields.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.region}</td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.career_years ? `${row.career_years}년` : '-'}</td>
                    <td style={{ padding: '12px 14px', color: '#555', fontSize: '13px' }}>
                      {METHODS.find(m => m.value === row.lesson_method)?.label ?? row.lesson_method}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#aaa', fontSize: '13px' }}>
                      {row.created_at ? new Date(row.created_at).toLocaleDateString('ko-KR') : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#ccc', fontSize: '14px' }}>해당 상태의 강사가 없습니다</div>
          )}
        </div>
      </div>

      {/* ── 우측 상세 패널 ──────────────────────── */}
      {selected && (
        <div style={{ position: 'sticky', top: '20px', backgroundColor: '#fff', border: '1px solid #eee', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
          {/* 패널 헤더 */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <span style={{ fontWeight: 800, fontSize: '15px' }}>{editMode ? '강사 수정' : '강사 상세'}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editMode && (
                <button onClick={() => setEditMode(true)}
                  style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>수정</button>
              )}
              <button onClick={() => { if (editMode && !confirm('수정을 취소하시겠습니까?')) return; setSelected(null); setEditMode(false) }}
                style={{ padding: '5px 10px', fontSize: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#aaa' }}>✕</button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {editMode ? (
              /* ── 수정 폼 ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <ProfileImageUpload value={form.profile_image} onChange={url => sf('profile_image', url)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><label style={labelS}>이름 *</label><input style={inputS} value={form.name} onChange={e => sf('name', e.target.value)} /></div>
                  <div><label style={labelS}>직책/역할</label><input style={inputS} placeholder="헤어 아티스트, 원장" value={form.role} onChange={e => sf('role', e.target.value)} /></div>
                  <div><label style={labelS}>소속 기관</label><input style={inputS} placeholder="뷰티아카데미, 프리랜서" value={form.company} onChange={e => sf('company', e.target.value)} /></div>
                  <div>
                    <label style={labelS}>지역</label>
                    <select style={inputS} value={form.region} onChange={e => sf('region', e.target.value)}>
                      {REGIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelS}>등급</label>
                    <select style={inputS} value={form.grade} onChange={e => sf('grade', e.target.value)}>
                      {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelS}>경력 (년)</label>
                    <input style={inputS} type="number" value={form.career_years} onChange={e => sf('career_years', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelS}>시작 금액 (원)</label>
                    <input style={inputS} type="number" value={form.price_min} onChange={e => sf('price_min', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelS}>수업 방식</label>
                    <select style={inputS} value={form.lesson_method} onChange={e => sf('lesson_method', e.target.value)}>
                      {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelS}>분야 (복수 선택)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {FIELDS_LIST.map(f => (
                      <button key={f} onClick={() => toggleField(f)}
                        style={{ padding: '5px 12px', fontSize: '12px', border: `1px solid ${form.fields.includes(f) ? '#5b0000' : '#ddd'}`, backgroundColor: form.fields.includes(f) ? '#5b0000' : '#fff', color: form.fields.includes(f) ? '#fff' : '#555', cursor: 'pointer', fontWeight: 600 }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelS}>강사 소개</label>
                  <textarea style={{ ...inputS, resize: 'vertical' }} rows={4} value={form.bio} onChange={e => sf('bio', e.target.value)} />
                </div>
                <div>
                  <label style={labelS}>강의 과목</label>
                  <TagInput tags={form.signature_style} onAdd={addTag} onRemove={removeTag} inputVal={form.signature_style_input} onInputChange={v => sf('signature_style_input', v)} />
                </div>
                <div>
                  <label style={labelS}>자격증 · 경력</label>
                  <TagInput tags={form.certifications} onAdd={addCert} onRemove={removeCert} inputVal={form.certifications_input} onInputChange={v => sf('certifications_input', v)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><label style={labelS}>인스타그램 URL</label><input style={inputS} placeholder="https://..." value={form.instagram_url} onChange={e => sf('instagram_url', e.target.value)} /></div>
                  <div><label style={labelS}>유튜브 URL</label><input style={inputS} placeholder="https://..." value={form.youtube_url} onChange={e => sf('youtube_url', e.target.value)} /></div>
                </div>
                <PortfolioUpload images={form.portfolio_images} onChange={imgs => sf('portfolio_images', imgs)} />
                <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                  <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', cursor: 'pointer' }}>취소</button>
                  <button onClick={handleSaveEdit} disabled={isPending} className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>저장</button>
                </div>
              </div>
            ) : (
              /* ── 상세 보기 ── */
              <>
                {/* 프로필 */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0e8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 10px' }}>
                    {selected.profile_image ? <img src={selected.profile_image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '18px' }}>{selected.name}</p>
                  <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                    {(selected.fields ?? []).join(' · ')} · {selected.region}
                  </p>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ padding: '3px 12px', fontSize: '12px', fontWeight: 700, backgroundColor: STATUS_LABEL[getStatus(selected)].bg, color: STATUS_LABEL[getStatus(selected)].color }}>
                      {STATUS_LABEL[getStatus(selected)].label}
                    </span>
                    {selected.is_active && <span style={{ padding: '3px 12px', fontSize: '12px', fontWeight: 700, backgroundColor: '#e0f2fe', color: '#0369a1' }}>활성</span>}
                  </div>
                </div>

                {/* 기본 정보 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '16px', backgroundColor: '#fafafa', padding: '16px', border: '1px solid #f0f0f0' }}>
                  {[
                    ['경력', selected.career_years ? `${selected.career_years}년` : '-'],
                    ['시작 금액', selected.price_min ? `${Number(selected.price_min).toLocaleString()}원~` : '-'],
                    ['수업 방식', METHODS.find(m => m.value === selected.lesson_method)?.label ?? selected.lesson_method ?? '-'],
                    ['매칭 수', `${selected.match_count ?? 0}건`],
                    ['평점', selected.rating ? `★ ${Number(selected.rating).toFixed(1)}` : '-'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ minWidth: '64px', color: '#aaa', flexShrink: 0 }}>{label}</span>
                      <span style={{ fontWeight: 600, color: '#222' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* 강사 소개 */}
                {selected.bio && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '6px' }}>강사 소개</p>
                    <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#444', backgroundColor: '#fafafa', padding: '12px', border: '1px solid #f0f0f0' }}>{selected.bio}</p>
                  </div>
                )}

                {/* 강의 과목 */}
                {(selected.signature_style ?? []).length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '8px' }}>강의 과목</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.signature_style.map(s => (
                        <span key={s} style={{ padding: '4px 10px', backgroundColor: '#f5f0ec', fontSize: '12px', color: '#5b0000', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* SNS */}
                {(selected.instagram_url || selected.youtube_url) && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '8px' }}>SNS / 채널</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selected.instagram_url && <a href={selected.instagram_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#5b0000', textDecoration: 'none', fontWeight: 600 }}>📸 인스타그램</a>}
                      {selected.youtube_url && <a href={selected.youtube_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#5b0000', textDecoration: 'none', fontWeight: 600 }}>▶️ 유튜브</a>}
                    </div>
                  </div>
                )}

                {/* 포트폴리오 */}
                {(selected.portfolio_images ?? []).length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '8px' }}>포트폴리오</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {selected.portfolio_images.map((url, i) => (
                        <img key={i} src={url} alt={`포트폴리오 ${i + 1}`}
                          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', border: '1px solid #f0f0f0' }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 승인/반려 */}
                {getStatus(selected) === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button onClick={() => handleApprove(selected.id, false)} disabled={isPending} className="btn-primary" style={{ flex: 1, padding: '11px', fontSize: '14px', textAlign: 'center' }}>승인</button>
                    <button onClick={() => handleApprove(selected.id, true)} disabled={isPending} style={{ flex: 1, padding: '11px', fontSize: '14px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#555' }}>반려</button>
                  </div>
                )}
                {getStatus(selected) !== 'pending' && (
                  <button onClick={() => { setData(prev => prev.map(d => d.id === selected.id ? { ...d, is_approved: false, is_active: true } : d)); setSelected(prev => prev ? { ...prev, is_approved: false, is_active: true } : null); startTransition(async () => { await updateInstructor(selected.id, { is_approved: false, is_active: true }) }) }}
                    style={{ width: '100%', padding: '10px', fontSize: '13px', border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', color: '#888', marginBottom: '8px' }}>
                    심사 대기로 되돌리기
                  </button>
                )}

                {/* 노출 토글 */}
                <button onClick={() => handleActive(selected.id, selected.is_active)} disabled={isPending}
                  style={{ width: '100%', padding: '10px', fontSize: '13px', border: '1px solid #eee', background: selected.is_active ? '#f0fdf4' : '#fafafa', cursor: 'pointer', color: selected.is_active ? '#166534' : '#888', marginBottom: '8px', fontWeight: 700 }}>
                  {selected.is_active ? '✓ 사이트 노출 중 (클릭하여 숨김)' : '○ 사이트 숨김 (클릭하여 노출)'}
                </button>

                {/* 삭제 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleDelete(selected.id)}
                    style={{ flex: 1, padding: '10px 14px', fontSize: '13px', border: '1px solid #ffcccc', backgroundColor: '#fff8f8', cursor: 'pointer', color: '#c00', fontWeight: 700 }}>
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
