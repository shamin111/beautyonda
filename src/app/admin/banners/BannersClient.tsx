'use client'

import { useState, useTransition, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createBanner, updateBanner, deleteBanner, reorderBanners } from './actions'

type Banner = {
  id: string
  title: string
  subtitle: string
  image_url: string
  link: string
  sort_order: number
  is_active: boolean
  clicks: number
  created_at: string
}

type FormState = { title: string; subtitle: string; image_url: string; link: string }

async function uploadToStorage(file: File): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const fileName = `banner-${Date.now()}.${ext}`
  const { data, error } = await supabase.storage.from('banners').upload(fileName, file, { upsert: true })
  if (error || !data) return null
  const { data: { publicUrl } } = supabase.storage.from('banners').getPublicUrl(data.path)
  return publicUrl
}

function ImageUploadField({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const url = await uploadToStorage(file)
    setUploading(false)
    if (url) {
      onChange(url)
    } else {
      setUploadError('업로드 실패. Supabase Storage "banners" 버킷이 있는지 확인하세요.')
    }
    e.target.value = ''
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#555' }}>
        배경 이미지
      </label>
      {/* 미리보기 */}
      {value && (
        <div style={{ marginBottom: '8px', position: 'relative', display: 'inline-block' }}>
          <img
            src={value}
            alt="배너 미리보기"
            style={{ height: '80px', maxWidth: '240px', objectFit: 'cover', display: 'block', border: '1px solid #ddd' }}
          />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', lineHeight: '20px' }}
          >×</button>
        </div>
      )}
      {/* URL 직접 입력 */}
      <input
        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '6px' }}
        placeholder="https://... (URL 직접 입력)"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {/* 파일 업로드 버튼 */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        style={{ padding: '7px 16px', border: '1px solid #5b0000', backgroundColor: uploading ? '#eee' : '#fff', color: uploading ? '#aaa' : '#5b0000', fontSize: '13px', cursor: uploading ? 'default' : 'pointer', fontWeight: 600 }}
      >
        {uploading ? '업로드 중...' : '📁 파일 업로드'}
      </button>
      <span style={{ fontSize: '12px', color: '#aaa', marginLeft: '8px' }}>JPG, PNG, WebP · 권장 1920×600px</span>
      {uploadError && <p style={{ fontSize: '12px', color: '#c00', marginTop: '4px' }}>{uploadError}</p>}
    </div>
  )
}

export default function BannersClient({ initialData }: { initialData: Banner[] }) {
  const [data, setData] = useState<Banner[]>(initialData)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>({ title: '', subtitle: '', image_url: '', link: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>({ title: '', subtitle: '', image_url: '', link: '' })
  const [isPending, startTransition] = useTransition()

  const toggleActive = (banner: Banner) => {
    setData(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
    startTransition(async () => {
      await updateBanner(banner.id, { is_active: !banner.is_active })
    })
  }

  const deleteItem = (id: string) => {
    if (!confirm('배너를 삭제하시겠습니까?')) return
    setData(prev => prev.filter(b => b.id !== id))
    if (editingId === id) setEditingId(null)
    startTransition(async () => {
      await deleteBanner(id)
    })
  }

  const startEdit = (b: Banner) => {
    setEditingId(b.id)
    setEditForm({ title: b.title, subtitle: b.subtitle, image_url: b.image_url ?? '', link: b.link ?? '' })
    setShowForm(false)
  }

  const cancelEdit = () => setEditingId(null)

  const handleSave = (id: string) => {
    setData(prev => prev.map(b => b.id === id ? { ...b, ...editForm } : b))
    setEditingId(null)
    startTransition(async () => {
      await updateBanner(id, {
        title: editForm.title,
        subtitle: editForm.subtitle,
        image_url: editForm.image_url,
        link: editForm.link,
      })
    })
  }

  const reorder = (newData: Banner[]) => {
    const reindexed = newData.map((b, i) => ({ ...b, sort_order: i + 1 }))
    setData(reindexed)
    startTransition(async () => {
      await reorderBanners(reindexed.map(b => b.id))
    })
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const next = [...data]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    reorder(next)
  }

  const moveDown = (idx: number) => {
    if (idx === data.length - 1) return
    const next = [...data]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    reorder(next)
  }

  const handleAdd = () => {
    if (!form.title) return
    startTransition(async () => {
      const { error } = await createBanner({
        title: form.title,
        subtitle: form.subtitle,
        image_url: form.image_url,
        link: form.link,
        sort_order: data.length + 1,
      })
      if (!error) {
        setForm({ title: '', subtitle: '', image_url: '', link: '' })
        setShowForm(false)
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', border: '1px solid #ddd',
    fontSize: '13px', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>배너 관리</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>메인 슬라이드 배너 업로드 및 노출 순서 관리</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setEditingId(null) }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>배너 제목 (메인 헤딩)</label>
                <input style={{ ...inputStyle, padding: '10px 12px', fontSize: '14px' }} placeholder="고수가 중수를, 중수가 하수를 끌어올린다" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>링크 URL</label>
                <input style={{ ...inputStyle, padding: '10px 12px', fontSize: '14px' }} placeholder="/register" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>서브타이틀</label>
              <input style={{ ...inputStyle, padding: '10px 12px', fontSize: '14px' }} placeholder="현업 경력자가 다음 단계를 이끄는 뷰티 클래스" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>배경 이미지</label>
              <ImageUploadField value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleAdd} disabled={isPending} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 목록 */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 60px 1fr 120px 80px 80px 100px 120px', gap: '12px', padding: '12px 20px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee', fontSize: '12px', fontWeight: 700, color: '#888' }}>
          <span>순서</span>
          <span>미리보기</span>
          <span>배너 정보</span>
          <span>링크</span>
          <span>클릭수</span>
          <span>등록일</span>
          <span>노출 상태</span>
          <span>관리</span>
        </div>
        {data.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
            등록된 배너가 없습니다. 배너를 추가해주세요.
          </div>
        )}
        {data.map((b, idx) => (
          <div key={b.id}>
            {/* 배너 행 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 60px 1fr 120px 80px 80px 100px 120px',
                gap: '12px',
                padding: '16px 20px',
                borderBottom: editingId === b.id ? 'none' : '1px solid #f5f5f5',
                alignItems: 'center',
                opacity: b.is_active ? 1 : 0.55,
                backgroundColor: editingId === b.id ? '#fef8f8' : undefined,
              }}
            >
              {/* 순서 이동 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{ background: 'none', border: '1px solid #ddd', width: '22px', height: '22px', cursor: 'pointer', fontSize: '10px', color: idx === 0 ? '#ccc' : '#555' }}>▲</button>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#888' }}>{b.sort_order}</span>
                <button onClick={() => moveDown(idx)} disabled={idx === data.length - 1} style={{ background: 'none', border: '1px solid #ddd', width: '22px', height: '22px', cursor: 'pointer', fontSize: '10px', color: idx === data.length - 1 ? '#ccc' : '#555' }}>▼</button>
              </div>

              {/* 미리보기 */}
              <div style={{ width: '56px', height: '36px', backgroundColor: '#1a0a0a', backgroundImage: b.image_url ? `url(${b.image_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                {!b.image_url && <span style={{ color: '#555' }}>🖼️</span>}
              </div>

              {/* 정보 */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</p>
                <p style={{ fontSize: '12px', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.subtitle}</p>
              </div>

              {/* 링크 */}
              <span style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.link || '-'}</span>

              {/* 클릭수 */}
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#5b0000' }}>{(b.clicks ?? 0).toLocaleString()}</span>

              {/* 등록일 */}
              <span style={{ fontSize: '12px', color: '#aaa' }}>{b.created_at ? new Date(b.created_at).toLocaleDateString('ko-KR') : '-'}</span>

              {/* 노출 토글 */}
              <button
                onClick={() => toggleActive(b)}
                disabled={isPending}
                style={{ padding: '5px 14px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', backgroundColor: b.is_active ? '#5b0000' : '#eee', color: b.is_active ? '#fff' : '#888', borderRadius: '20px' }}
              >
                {b.is_active ? '노출 중' : '숨김'}
              </button>

              {/* 관리 */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => editingId === b.id ? cancelEdit() : startEdit(b)}
                  style={{ padding: '5px 10px', fontSize: '12px', border: `1px solid ${editingId === b.id ? '#5b0000' : '#ddd'}`, backgroundColor: editingId === b.id ? '#5b0000' : '#fff', cursor: 'pointer', color: editingId === b.id ? '#fff' : '#555' }}
                >
                  {editingId === b.id ? '닫기' : '수정'}
                </button>
                <button
                  onClick={() => deleteItem(b.id)}
                  style={{ padding: '5px 10px', fontSize: '12px', border: '1px solid #ffcccc', backgroundColor: '#fff8f8', cursor: 'pointer', color: '#c00' }}
                >
                  삭제
                </button>
              </div>
            </div>

            {/* 인라인 수정 폼 */}
            {editingId === b.id && (
              <div style={{ padding: '20px 24px', backgroundColor: '#fef8f8', borderBottom: '1px solid #f5f5f5', borderTop: '1px solid #f0e0e0' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#5b0000', marginBottom: '14px' }}>배너 수정</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 2 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#555' }}>제목 (메인 헤딩)</label>
                      <input style={inputStyle} value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#555' }}>링크 URL</label>
                      <input style={inputStyle} placeholder="/register" value={editForm.link} onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#555' }}>서브타이틀</label>
                    <input style={inputStyle} value={editForm.subtitle} onChange={e => setEditForm(f => ({ ...f, subtitle: e.target.value }))} />
                  </div>
                  <ImageUploadField
                    value={editForm.image_url}
                    onChange={url => setEditForm(f => ({ ...f, image_url: url }))}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={cancelEdit} style={{ padding: '8px 18px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer' }}>취소</button>
                    <button onClick={() => handleSave(b.id)} disabled={isPending} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>저장</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '16px 20px', backgroundColor: '#fffbf0', border: '1px solid #f5e8c0', fontSize: '13px', color: '#886' }}>
        <strong>안내</strong> · 권장 이미지: 1920×600px, JPG/PNG/WebP · Supabase Storage &quot;banners&quot; 버킷 필요 · 노출 중인 배너만 메인 슬라이드에 표시됩니다
      </div>
    </div>
  )
}
