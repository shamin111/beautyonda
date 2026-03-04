'use client'

import { useState } from 'react'

const MOCK = [
  { id: 'B001', title: '2025 봄 특강 모집', image: '/banners/spring.jpg', link: '/news/1', order: 1, active: true, clicks: 142, created: '2025.03.01' },
  { id: 'B002', title: '강사 등록 이벤트', image: '/banners/register.jpg', link: '/register', order: 2, active: true, clicks: 89, created: '2025.02.20' },
  { id: 'B003', title: '파트너 모집 공고', image: '/banners/partner.jpg', link: '/partner', order: 3, active: false, clicks: 34, created: '2025.02.10' },
]

export default function AdminBannersPage() {
  const [data, setData] = useState(MOCK)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', link: '', order: '' })

  const toggleActive = (id: string) =>
    setData(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))

  const deleteItem = (id: string) =>
    setData(prev => prev.filter(b => b.id !== id))

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setData(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((b, i) => ({ ...b, order: i + 1 }))
    })
  }

  const moveDown = (idx: number) => {
    if (idx === data.length - 1) return
    setData(prev => {
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((b, i) => ({ ...b, order: i + 1 }))
    })
  }

  const handleAdd = () => {
    if (!form.title) return
    const newBanner = {
      id: `B${String(Date.now()).slice(-3)}`,
      title: form.title,
      image: '',
      link: form.link,
      order: data.length + 1,
      active: false,
      clicks: 0,
      created: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''),
    }
    setData(prev => [...prev, newBanner])
    setForm({ title: '', link: '', order: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>배너 관리</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>메인 슬라이드 배너 업로드 및 노출 순서 관리</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="btn-primary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          + 배너 추가
        </button>
      </div>

      {/* 배너 추가 폼 */}
      {showForm && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>새 배너 등록</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>배너 이미지 업로드</label>
              <div style={{ border: '2px dashed #ddd', padding: '32px', textAlign: 'center', backgroundColor: '#fafafa', cursor: 'pointer' }}>
                <p style={{ fontSize: '14px', color: '#aaa' }}>클릭하여 이미지 선택 (권장: 1920×600px, JPG/PNG)</p>
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>배너 제목</label>
                <input
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                  placeholder="배너 설명 제목"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>링크 URL</label>
                <input
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                  placeholder="/register"
                  value={form.link}
                  onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleAdd} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 목록 */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
        {/* 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: '48px 60px 1fr 120px 80px 80px 100px 100px', gap: '12px', padding: '12px 20px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee', fontSize: '12px', fontWeight: 700, color: '#888' }}>
          <span>순서</span>
          <span>미리보기</span>
          <span>배너 정보</span>
          <span>링크</span>
          <span>클릭수</span>
          <span>등록일</span>
          <span>노출 상태</span>
          <span>관리</span>
        </div>
        {data.map((b, idx) => (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '48px 60px 1fr 120px 80px 80px 100px 100px',
              gap: '12px',
              padding: '16px 20px',
              borderBottom: '1px solid #f5f5f5',
              alignItems: 'center',
              opacity: b.active ? 1 : 0.5,
            }}
          >
            {/* 순서 이동 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                style={{ background: 'none', border: '1px solid #ddd', width: '22px', height: '22px', cursor: 'pointer', fontSize: '10px', color: idx === 0 ? '#ccc' : '#555' }}
              >▲</button>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#888' }}>{b.order}</span>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === data.length - 1}
                style={{ background: 'none', border: '1px solid #ddd', width: '22px', height: '22px', cursor: 'pointer', fontSize: '10px', color: idx === data.length - 1 ? '#ccc' : '#555' }}
              >▼</button>
            </div>

            {/* 미리보기 */}
            <div style={{ width: '56px', height: '36px', backgroundColor: '#f0e8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🖼️
            </div>

            {/* 정보 */}
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{b.title}</p>
              <p style={{ fontSize: '12px', color: '#aaa' }}>{b.id}</p>
            </div>

            {/* 링크 */}
            <span style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>{b.link}</span>

            {/* 클릭수 */}
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#5b0000' }}>{b.clicks.toLocaleString()}</span>

            {/* 등록일 */}
            <span style={{ fontSize: '12px', color: '#aaa' }}>{b.created}</span>

            {/* 노출 토글 */}
            <div>
              <button
                onClick={() => toggleActive(b.id)}
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: b.active ? '#5b0000' : '#eee',
                  color: b.active ? '#fff' : '#888',
                  borderRadius: '20px',
                }}
              >
                {b.active ? '노출 중' : '숨김'}
              </button>
            </div>

            {/* 관리 */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', color: '#555' }}
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (confirm('배너를 삭제하시겠습니까?')) deleteItem(b.id)
                }}
                style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid #ffcccc', backgroundColor: '#fff8f8', cursor: 'pointer', color: '#c00' }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 */}
      <div style={{ marginTop: '20px', padding: '16px 20px', backgroundColor: '#fffbf0', border: '1px solid #f5e8c0', fontSize: '13px', color: '#886' }}>
        <strong>안내</strong> · 권장 이미지 크기: 1920 × 600px (JPG, PNG, WebP) · 최대 파일 크기: 5MB · 노출 중인 배너만 메인 슬라이드에 표시됩니다 · 순서 변경 후 자동 저장됩니다
      </div>
    </div>
  )
}
