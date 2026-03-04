'use client'

import { useState, useRef } from 'react'

type Instructor = {
  id: string
  name: string
  phone: string
  field: string
  region: string
  career: string
  price: string
  method: string
  status: string
  date: string
  photo: string
  intro: string
  subjects: string
  sns: string
  source: 'apply' | 'admin' // 신청 or 관리자 직접 등록
}

const MOCK: Instructor[] = [
  { id: 'A001', name: '한미래', phone: '010-1234-5678', field: '헤어', region: '서울', career: '5년', price: '6만원~', method: '대면', status: 'pending', date: '2025.03.05', photo: '', intro: '현업 헤어 디자이너 출신 강사입니다. 커트, 펌, 염색 전 과정 강의 가능합니다.', subjects: '기초 커트 / 레이어 커트 / 볼륨 펌 / 매직', sns: '@hairmirael', source: 'apply' },
  { id: 'A002', name: '정소희', phone: '010-2345-6789', field: '웨딩', region: '경기', career: '8년', price: '10만원~', method: '대면', status: 'pending', date: '2025.03.04', photo: '', intro: '웨딩 헤어&메이크업 전문 강사. 대형 웨딩홀 경력 8년.', subjects: '웨딩 업스타일 / 브라이덜 메이크업 / 드레이핑', sns: '@sohee_wedding', source: 'apply' },
  { id: 'A003', name: '오지훈', phone: '010-3456-7890', field: '메이크업', region: '인천', career: '3년', price: '5만원~', method: '온라인', status: 'approved', date: '2025.03.02', photo: '', intro: '뷰티 유튜버 출신 메이크업 강사. 온라인 강의 전문.', subjects: '데일리 메이크업 / 글로우 메이크업 / 눈썹 디자인', sns: '@ojihun_beauty', source: 'apply' },
  { id: 'A004', name: '윤채린', phone: '010-4567-8901', field: '네일', region: '서울', career: '6년', price: '4만원~', method: '대면', status: 'rejected', date: '2025.03.01', photo: '', intro: '네일아트 전문 강사. 젤, 아크릴, 아트 전 과정.', subjects: '젤 네일 / 아크릴 스컬프쳐 / 네일 아트', sns: '@nail_chaerin', source: 'apply' },
  { id: 'A005', name: '강도현', phone: '010-5678-9012', field: 'SMP', region: '경기', career: '10년', price: '15만원~', method: '대면', status: 'approved', date: '2025.02.28', photo: '', intro: 'SMP(두피문신) 전문가. 탈모 솔루션 강의 가능.', subjects: 'SMP 기초 / 헤어라인 디자인 / 탈모 커버', sns: '@smp_kang', source: 'admin' },
]

const FIELDS = ['헤어', '메이크업', '네일', '피부관리', '웨딩', 'SMP', '속눈썹', '반영구']
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '제주', '기타']
const METHODS = ['대면', '온라인', '대면+온라인']

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: '심사 대기', color: '#92400e', bg: '#fef3c7' },
  approved: { label: '승인', color: '#065f46', bg: '#d1fae5' },
  rejected: { label: '반려', color: '#991b1b', bg: '#fee2e2' },
}

const EMPTY_FORM = {
  name: '', phone: '', field: '헤어', region: '서울', career: '',
  price: '', method: '대면', intro: '', subjects: '', sns: '',
}

export default function AdminInstructorsPage() {
  const [filter, setFilter] = useState('all')
  const [data, setData] = useState<Instructor[]>(MOCK)
  const [selected, setSelected] = useState<Instructor | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [editPhoto, setEditPhoto] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (isEdit) setEditPhoto(ev.target?.result as string)
      else setPhotoPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = () => {
    if (!form.name || !form.phone) return alert('이름과 연락처는 필수입니다.')
    const newItem: Instructor = {
      id: `A${String(Date.now()).slice(-3)}`,
      ...form,
      photo: photoPreview,
      status: 'approved',
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
      source: 'admin',
    }
    setData(prev => [newItem, ...prev])
    setForm(EMPTY_FORM)
    setPhotoPreview('')
    setShowForm(false)
  }

  const handleSaveEdit = () => {
    if (!selected) return
    setData(prev => prev.map(d => d.id === selected.id
      ? { ...d, ...form, photo: editPhoto || d.photo }
      : d
    ))
    setSelected(prev => prev ? { ...prev, ...form, photo: editPhoto || prev.photo } : null)
    setEditMode(false)
  }

  const updateStatus = (id: string, status: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const openDetail = (row: Instructor) => {
    setSelected(row)
    setEditMode(false)
    setEditPhoto('')
    setForm({
      name: row.name, phone: row.phone, field: row.field, region: row.region,
      career: row.career, price: row.price, method: row.method,
      intro: row.intro, subjects: row.subjects, sns: row.sns,
    })
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none', backgroundColor: '#fff',
  } as React.CSSProperties

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: '24px', alignItems: 'flex-start' }}>

      {/* 좌측 목록 */}
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

        {/* 직접 등록 폼 */}
        {showForm && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', color: '#5b0000' }}>강사 직접 등록</h2>

            {/* 사진 업로드 */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '100px', height: '100px', border: '2px dashed #ddd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0, overflow: 'hidden', backgroundColor: '#fafafa',
                }}
              >
                {photoPreview
                  ? <img src={photoPreview} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center', color: '#bbb' }}>
                      <div style={{ fontSize: '24px' }}>📷</div>
                      <div style={{ fontSize: '11px', marginTop: '4px' }}>사진 선택</div>
                    </div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoChange(e)} />
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
                <p style={{ fontWeight: 700, color: '#555', marginBottom: '4px' }}>프로필 사진</p>
                <p>· 권장 크기: 400 × 400px 이상</p>
                <p>· JPG, PNG, WebP 형식</p>
                <p>· 최대 5MB</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['name', '이름 *', '홍길동'], ['phone', '연락처 *', '010-0000-0000']].map(([k, label, ph]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>{label}</label>
                  <input style={inputStyle} placeholder={ph} value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>분야 *</label>
                <select style={inputStyle} value={form.field} onChange={e => set('field', e.target.value)}>
                  {FIELDS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>지역 *</label>
                <select style={inputStyle} value={form.region} onChange={e => set('region', e.target.value)}>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>경력</label>
                <input style={inputStyle} placeholder="예) 5년" value={form.career} onChange={e => set('career', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>수강료</label>
                <input style={inputStyle} placeholder="예) 6만원~" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>수업 방식</label>
                <select style={inputStyle} value={form.method} onChange={e => set('method', e.target.value)}>
                  {METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>SNS</label>
                <input style={inputStyle} placeholder="예) @instagram_id" value={form.sns} onChange={e => set('sns', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>강사 소개</label>
              <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="강사 소개 문구를 입력하세요" value={form.intro} onChange={e => set('intro', e.target.value)} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: '#555' }}>강의 과목</label>
              <input style={inputStyle} placeholder="예) 기초 커트 / 레이어 커트 / 볼륨 펌" value={form.subjects} onChange={e => set('subjects', e.target.value)} />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowForm(false); setPhotoPreview('') }}
                style={{ padding: '10px 20px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={handleAdd} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                등록 완료
              </button>
            </div>
          </div>
        )}

        {/* 필터 탭 */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
          {[['all', '전체'], ['pending', '심사 대기'], ['approved', '승인됨'], ['rejected', '반려됨']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: filter === val ? '#5b0000' : '#888', borderBottom: filter === val ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px' }}>
              {label}
              <span style={{ marginLeft: '6px', fontSize: '12px', color: filter === val ? '#5b0000' : '#bbb' }}>
                {val === 'all' ? data.length : data.filter(d => d.status === val).length}
              </span>
            </button>
          ))}
        </div>

        {/* 테이블 */}
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
                const s = STATUS_MAP[row.status]
                const isSelected = selected?.id === row.id
                return (
                  <tr key={row.id}
                    onClick={() => openDetail(row)}
                    style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', backgroundColor: isSelected ? '#fff9f5' : '#fff' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#fafafa' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelected ? '#fff9f5' : '#fff' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0e8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {row.photo ? <img src={row.photo} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700 }}>{row.name}</div>
                      {row.source === 'admin' && <div style={{ fontSize: '11px', color: '#aaa' }}>직접 등록</div>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.field}</td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.region}</td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.career}</td>
                    <td style={{ padding: '12px 14px', color: '#555' }}>{row.method}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#aaa', fontSize: '13px' }}>{row.date}</td>
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

      {/* 우측 상세 패널 */}
      {selected && (
        <div style={{ position: 'sticky', top: '20px', backgroundColor: '#fff', border: '1px solid #eee' }}>
          {/* 헤더 */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px' }}>강사 상세</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!editMode && (
                <button onClick={() => setEditMode(true)}
                  style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                  수정
                </button>
              )}
              <button onClick={() => setSelected(null)}
                style={{ padding: '5px 10px', fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer', color: '#aaa' }}>✕</button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* 프로필 사진 */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0e8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto' }}>
                  {(editMode ? editPhoto : selected.photo)
                    ? <img src={editMode ? editPhoto || selected.photo : selected.photo} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '👤'
                  }
                </div>
                {editMode && (
                  <button onClick={() => editFileRef.current?.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#5b0000', border: '2px solid #fff', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📷
                  </button>
                )}
              </div>
              <input ref={editFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoChange(e, true)} />
              {!editMode && (
                <>
                  <p style={{ fontWeight: 800, fontSize: '18px', marginTop: '10px' }}>{selected.name}</p>
                  <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{selected.field} · {selected.region}</p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ padding: '3px 12px', fontSize: '12px', fontWeight: 700, backgroundColor: STATUS_MAP[selected.status].bg, color: STATUS_MAP[selected.status].color }}>
                      {STATUS_MAP[selected.status].label}
                    </span>
                  </div>
                </>
              )}
            </div>

            {editMode ? (
              /* 수정 폼 */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['name', '이름'], ['phone', '연락처']].map(([k, label]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>{label}</label>
                      <input style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={(form as any)[k]} onChange={e => set(k, e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>분야</label>
                    <select style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.field} onChange={e => set('field', e.target.value)}>
                      {FIELDS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>지역</label>
                    <select style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.region} onChange={e => set('region', e.target.value)}>
                      {REGIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>경력</label>
                    <input style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.career} onChange={e => set('career', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>수강료</label>
                    <input style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.price} onChange={e => set('price', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>수업 방식</label>
                    <select style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.method} onChange={e => set('method', e.target.value)}>
                      {METHODS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>SNS</label>
                    <input style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.sns} onChange={e => set('sns', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>강사 소개</label>
                  <textarea style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px', resize: 'none' }} rows={3} value={form.intro} onChange={e => set('intro', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#888' }}>강의 과목</label>
                  <input style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} value={form.subjects} onChange={e => set('subjects', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button onClick={() => { setEditMode(false); setEditPhoto('') }}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', cursor: 'pointer' }}>취소</button>
                  <button onClick={handleSaveEdit} className="btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '13px' }}>저장</button>
                </div>
              </div>
            ) : (
              /* 상세 보기 */
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
                  {[
                    ['연락처', selected.phone],
                    ['경력', selected.career],
                    ['수강료', selected.price],
                    ['수업 방식', selected.method],
                    ['SNS', selected.sns || '-'],
                    ['등록일', selected.date],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ minWidth: '64px', color: '#aaa', fontSize: '13px', flexShrink: 0 }}>{label}</span>
                      <span style={{ fontWeight: 600, color: '#222', fontSize: '13px' }}>{value}</span>
                    </div>
                  ))}
                </div>

                {selected.intro && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '6px' }}>강사 소개</p>
                    <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#444', backgroundColor: '#fafafa', padding: '12px', border: '1px solid #f0f0f0' }}>{selected.intro}</p>
                  </div>
                )}

                {selected.subjects && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '8px' }}>강의 과목</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.subjects.split('/').map(s => (
                        <span key={s} style={{ padding: '4px 10px', backgroundColor: '#f5f0ec', fontSize: '12px', color: '#5b0000', fontWeight: 600 }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 승인/반려 버튼 */}
                {selected.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button onClick={() => updateStatus(selected.id, 'approved')} className="btn-primary"
                      style={{ flex: 1, padding: '11px', fontSize: '14px', textAlign: 'center' }}>
                      승인
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'rejected')}
                      style={{ flex: 1, padding: '11px', fontSize: '14px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#555' }}>
                      반려
                    </button>
                  </div>
                )}
                {selected.status !== 'pending' && (
                  <button onClick={() => updateStatus(selected.id, 'pending')}
                    style={{ width: '100%', padding: '10px', fontSize: '13px', border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', color: '#888', marginBottom: '12px' }}>
                    심사 대기로 되돌리기
                  </button>
                )}

                <a href={`tel:${selected.phone}`}
                  style={{ display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #5b0000', color: '#5b0000', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                  📞 전화하기
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
