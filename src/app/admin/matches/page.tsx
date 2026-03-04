'use client'

import { useState } from 'react'

const MOCK = [
  { id: 'M001', name: '김수진', phone: '010-1234-5678', fields: ['헤어'], region: '서울', method: 'offline', level: '초급', price: '5~10만원', status: 'pending', date: '2025.03.05', instructor: null },
  { id: 'M002', name: '이민호', phone: '010-2345-6789', fields: ['메이크업'], region: '경기', method: 'online', level: '입문', price: '5만원 이하', status: 'matched', date: '2025.03.04', instructor: '박소연' },
  { id: 'M003', name: '박지현', phone: '010-3456-7890', fields: ['네일'], region: '서울', method: 'offline', level: '중급', price: '5~10만원', status: 'completed', date: '2025.03.03', instructor: '김민지' },
  { id: 'M004', name: '최영수', phone: '010-4567-8901', fields: ['피부관리'], region: '부산', method: 'offline', level: '고급', price: '10~20만원', status: 'pending', date: '2025.03.03', instructor: null },
  { id: 'M005', name: '정하은', phone: '010-5678-9012', fields: ['헤어', '업스타일'], region: '서울', method: 'offline', level: '초급', price: '5~10만원', status: 'in_progress', date: '2025.03.01', instructor: '이지연' },
]

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; next: string; nextLabel: string }> = {
  pending:     { label: '대기', color: '#92400e', bg: '#fef3c7', next: 'matched', nextLabel: '매칭 처리' },
  matched:     { label: '매칭됨', color: '#1e40af', bg: '#dbeafe', next: 'in_progress', nextLabel: '진행 확인' },
  in_progress: { label: '진행중', color: '#065f46', bg: '#d1fae5', next: 'completed', nextLabel: '완료 처리' },
  completed:   { label: '완료', color: '#374151', bg: '#f3f4f6', next: '', nextLabel: '' },
  cancelled:   { label: '취소', color: '#991b1b', bg: '#fee2e2', next: '', nextLabel: '' },
}

const LEVEL_KR: Record<string, string> = {
  beginner: '입문', elementary: '초급', intermediate: '중급', advanced: '고급',
}

export default function AdminMatchesPage() {
  const [filter, setFilter] = useState('all')
  const [data, setData] = useState(MOCK)

  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter)

  const updateStatus = (id: string, status: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>매칭 관리</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>신청 접수 확인 및 강사 연결 처리</p>
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #eee', marginBottom: '24px' }}>
        {[['all', '전체'], ['pending', '대기'], ['matched', '매칭됨'], ['in_progress', '진행중'], ['completed', '완료']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '12px 18px', fontSize: '14px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: filter === val ? '#5b0000' : '#888', borderBottom: filter === val ? '2px solid #5b0000' : '2px solid transparent', marginBottom: '-2px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #eee' }}>
              {['신청자', '연락처', '분야', '지역', '수준', '예산', '매칭 강사', '신청일', '상태', '처리'].map(h => (
                <th key={h} style={{ padding: '14px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const s = STATUS_MAP[row.status]
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid #f5f5f5' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}>
                  <td style={{ padding: '14px 14px', fontWeight: 700 }}>{row.name}</td>
                  <td style={{ padding: '14px 14px', color: '#555', fontSize: '13px' }}>{row.phone}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {row.fields.map(f => (
                        <span key={f} style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#fff5ed', color: '#5b0000', fontWeight: 600 }}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', color: '#555' }}>{row.region}</td>
                  <td style={{ padding: '14px 14px', color: '#555' }}>{row.level}</td>
                  <td style={{ padding: '14px 14px', color: '#555', fontSize: '13px' }}>{row.price}</td>
                  <td style={{ padding: '14px 14px', color: row.instructor ? '#141414' : '#ccc', fontSize: '13px' }}>
                    {row.instructor ?? '미배정'}
                  </td>
                  <td style={{ padding: '14px 14px', color: '#aaa', fontSize: '13px' }}>{row.date}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    {s.next && (
                      <button onClick={() => updateStatus(row.id, s.next)}
                        style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 700, backgroundColor: '#5b0000', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {s.nextLabel}
                      </button>
                    )}
                    {!s.next && <span style={{ fontSize: '12px', color: '#ccc' }}>—</span>}
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
