'use client'

import { useState, useTransition } from 'react'
import type { News, NewsCategory } from '@/types'
import {
  createNotice, updateNotice, deleteNotice, togglePublish,
} from './actions'

const CATEGORIES = ['공지사항', '이벤트', '오픈클래스', '협회소식', '컨테스트']

type Mode = 'list' | 'view' | 'write' | 'edit'

const EMPTY: { category: NewsCategory; title: string; content: string; is_published: boolean } = { category: '공지사항', title: '', content: '', is_published: false }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

export default function NoticesClient({ initialData }: { initialData: News[] }) {
  const [data, setData] = useState<News[]>(initialData)
  const [mode, setMode] = useState<Mode>('list')
  const [selected, setSelected] = useState<News | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [filterCat, setFilterCat] = useState('전체')
  const [isPending, startTransition] = useTransition()

  const set = (k: keyof typeof EMPTY, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const filtered = filterCat === '전체' ? data : data.filter(d => d.category === filterCat)

  const openView = (item: News) => { setSelected(item); setMode('view') }
  const openEdit = (item: News) => {
    setForm({ category: item.category, title: item.title, content: item.content, is_published: item.is_published })
    setSelected(item); setMode('edit')
  }
  const openWrite = () => { setForm(EMPTY); setSelected(null); setMode('write') }

  const handleSave = () => {
    if (!form.title.trim()) return alert('제목을 입력하세요.')
    if (!form.content.trim()) return alert('내용을 입력하세요.')

    startTransition(async () => {
      if (mode === 'edit' && selected) {
        await updateNotice(selected.id, form)
        const updated = { ...selected, ...form, updated_at: new Date().toISOString() }
        setData(prev => prev.map(d => d.id === selected.id ? updated : d))
        setSelected(updated)
        setMode('view')
      } else {
        await createNotice(form)
        // 목록 새로고침 (revalidatePath로 다음 방문 시 갱신됨)
        setMode('list')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    startTransition(async () => {
      await deleteNotice(id)
      setData(prev => prev.filter(d => d.id !== id))
      setMode('list')
      setSelected(null)
    })
  }

  const handleTogglePublish = (item: News) => {
    startTransition(async () => {
      await togglePublish(item.id, item.is_published)
      setData(prev => prev.map(d => d.id === item.id ? { ...d, is_published: !d.is_published } : d))
      setSelected(prev => prev?.id === item.id ? { ...prev, is_published: !prev.is_published } : prev)
    })
  }

  const backBtn = (
    <button onClick={() => setMode('list')}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '20px' }}>
      ← 목록으로
    </button>
  )

  /* ── 글쓰기 / 수정 폼 ── */
  if (mode === 'write' || mode === 'edit') {
    return (
      <div>
        {backBtn}
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>{mode === 'edit' ? '게시물 수정' : '새 게시물 등록'}</h1>
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#888', marginBottom: '6px' }}>카테고리</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #ddd', fontSize: '14px', backgroundColor: '#fff', outline: 'none' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#888', marginBottom: '6px' }}>제목 *</label>
              <input placeholder="게시물 제목" value={form.title} onChange={e => set('title', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#888', marginBottom: '6px' }}>내용 *</label>
            <textarea placeholder="내용을 입력하세요" value={form.content} onChange={e => set('content', e.target.value)}
              rows={14}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', outline: 'none', lineHeight: 1.8, fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} style={{ accentColor: '#5b0000', width: '16px', height: '16px' }} />
              즉시 발행
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setMode(selected ? 'view' : 'list')}
                style={{ padding: '11px 20px', border: '1px solid #ddd', background: '#fff', fontSize: '14px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ padding: '11px 28px', fontSize: '14px' }}>
                {isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── 글보기 ── */
  if (mode === 'view' && selected) {
    const s = selected
    return (
      <div>
        {backBtn}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 10px', backgroundColor: '#f5f0ec', color: '#5b0000' }}>{s.category}</span>
              <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.is_published ? '#d1fae5' : '#f3f4f6', color: s.is_published ? '#065f46' : '#888' }}>
                {s.is_published ? '발행중' : '비공개'}
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.3 }}>{s.title}</h1>
            <p style={{ fontSize: '13px', color: '#aaa' }}>등록일: {formatDate(s.created_at)} · 조회수: {s.view_count}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => handleTogglePublish(s)} disabled={isPending}
              style={{ padding: '9px 16px', fontSize: '13px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#555' }}>
              {s.is_published ? '비공개로 전환' : '발행하기'}
            </button>
            <button onClick={() => openEdit(s)}
              style={{ padding: '9px 16px', fontSize: '13px', border: '1px solid #5b0000', background: '#fff', cursor: 'pointer', fontWeight: 700, color: '#5b0000' }}>
              수정
            </button>
            <button onClick={() => handleDelete(s.id)} disabled={isPending}
              style={{ padding: '9px 16px', fontSize: '13px', border: '1px solid #fee2e2', background: '#fee2e2', cursor: 'pointer', fontWeight: 700, color: '#991b1b' }}>
              삭제
            </button>
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', minHeight: '300px' }}>
          <p style={{ fontSize: '16px', lineHeight: 2, color: '#333', whiteSpace: 'pre-wrap' }}>{s.content}</p>
        </div>
      </div>
    )
  }

  /* ── 목록 ── */
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>공지·뉴스 관리</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>게시물 등록, 수정, 발행 관리</p>
        </div>
        <button onClick={openWrite} className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px' }}>
          + 새 게시물
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
        {['전체', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: filterCat === cat ? '#5b0000' : '#888', borderBottom: filterCat === cat ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #eee' }}>
              {['카테고리', '제목', '발행 상태', '조회수', '등록일', '관리'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', backgroundColor: '#f5f0ec', color: '#5b0000' }}>{row.category}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => openView(row)}
                    style={{ fontWeight: 600, color: '#141414', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', textAlign: 'left', padding: 0 }}>
                    {row.title}
                  </button>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => handleTogglePublish(row)} disabled={isPending}
                    style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', backgroundColor: row.is_published ? '#d1fae5' : '#f3f4f6', color: row.is_published ? '#065f46' : '#888' }}>
                    {row.is_published ? '발행중' : '비공개'}
                  </button>
                </td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{row.view_count}</td>
                <td style={{ padding: '14px 16px', color: '#aaa', fontSize: '13px' }}>{formatDate(row.created_at)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openView(row)} style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>보기</button>
                    <button onClick={() => openEdit(row)} style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>수정</button>
                    <button onClick={() => handleDelete(row.id)} disabled={isPending}
                      style={{ padding: '5px 12px', fontSize: '12px', border: '1px solid #fee2e2', background: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#ccc', fontSize: '14px' }}>게시물이 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
