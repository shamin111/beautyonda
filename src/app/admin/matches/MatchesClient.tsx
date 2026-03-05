'use client'

import { useState, useTransition } from 'react'
import { updateMatchStatus, deleteMatchRequest } from './actions'

type MatchReq = {
  id: string; category: string; title: string; contact_name: string; contact_phone: string
  location_si: string; lecture_type: string; budget?: string; status: string; created_at: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; next: string; nextLabel: string }> = {
  pending:     { label: '대기', color: '#92400e', bg: '#fef3c7', next: 'matched', nextLabel: '매칭 처리' },
  matched:     { label: '매칭됨', color: '#1e40af', bg: '#dbeafe', next: 'in_progress', nextLabel: '진행 확인' },
  in_progress: { label: '진행중', color: '#065f46', bg: '#d1fae5', next: 'completed', nextLabel: '완료 처리' },
  completed:   { label: '완료', color: '#374151', bg: '#f3f4f6', next: '', nextLabel: '' },
  cancelled:   { label: '취소', color: '#991b1b', bg: '#fee2e2', next: '', nextLabel: '' },
}

export default function MatchesClient({ initialData }: { initialData: MatchReq[] }) {
  const [filter, setFilter] = useState('all')
  const [data, setData] = useState(initialData)
  const [, startTransition] = useTransition()

  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter)

  const handleUpdateStatus = (id: string, status: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    startTransition(() => updateMatchStatus(id, status))
  }

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id))
    startTransition(() => deleteMatchRequest(id))
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>매칭·섭외문의 관리</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>신청 접수 확인 및 강사 연결 처리 ({data.length}건)</p>
      </div>

      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #eee', marginBottom: '24px' }}>
        {[['all', '전체'], ['pending', '대기'], ['matched', '매칭됨'], ['in_progress', '진행중'], ['completed', '완료']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '12px 18px', fontSize: '14px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: filter === val ? '#5b0000' : '#888', borderBottom: filter === val ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#ccc' }}>데이터가 없습니다</div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #eee' }}>
              {['분야', '제목', '신청자', '연락처', '지역', '강의유형', '예산', '등록일', '상태', '처리'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const s = STATUS_MAP[row.status] ?? STATUS_MAP.pending
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#fff5ed', color: '#5b0000', fontWeight: 600 }}>{row.category}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{row.contact_name || '-'}</td>
                  <td style={{ padding: '12px 14px', color: '#555', fontSize: '13px' }}>{row.contact_phone || '-'}</td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{row.location_si}</td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{row.lecture_type}</td>
                  <td style={{ padding: '12px 14px', color: '#555', fontSize: '13px' }}>{row.budget || '-'}</td>
                  <td style={{ padding: '12px 14px', color: '#aaa', fontSize: '13px' }}>
                    {new Date(row.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {s.next && (
                        <button onClick={() => handleUpdateStatus(row.id, s.next)}
                          style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: '#5b0000', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {s.nextLabel}
                        </button>
                      )}
                      <button onClick={() => handleDelete(row.id)}
                        style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: '#fff', color: '#888', border: '1px solid #eee', cursor: 'pointer' }}>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
