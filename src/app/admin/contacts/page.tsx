'use client'

import { useState } from 'react'

const MOCK = [
  { id: 'C001', name: '홍길동', phone: '010-1234-5678', type: '강사 등록 문의', message: '강사 등록을 하고 싶은데 조건이 어떻게 되나요?', is_read: false, date: '2025.03.05' },
  { id: 'C002', name: '김영희', phone: '010-2345-6789', type: '강사 매칭 문의', message: '헤어 강사를 찾고 있는데 어떻게 신청하면 되나요?', is_read: true, date: '2025.03.04' },
  { id: 'C003', name: '이철수', phone: '010-3456-7890', type: '파트너·지사 문의', message: '경기 지역 파트너로 활동하고 싶습니다.', is_read: false, date: '2025.03.03' },
]

export default function AdminContactsPage() {
  const [data, setData] = useState(MOCK)
  const [selected, setSelected] = useState<typeof MOCK[0] | null>(null)

  const markRead = (id: string) => setData(prev => prev.map(d => d.id === id ? { ...d, is_read: true } : d))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>문의 관리</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>접수된 문의 내역 확인</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
          {data.map(row => (
            <div key={row.id}
              onClick={() => { setSelected(row); markRead(row.id) }}
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                backgroundColor: selected?.id === row.id ? '#fff9f5' : '#fff',
                borderLeft: !row.is_read ? '3px solid #5b0000' : '3px solid transparent',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {!row.is_read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5b0000', display: 'inline-block' }} />}
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{row.name}</span>
                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#f5f5f5', color: '#555' }}>{row.type}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{row.date}</span>
              </div>
              <p style={{ fontSize: '14px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 보기 */}
      <div style={{ position: 'sticky', top: '20px' }}>
        {selected ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>문의 상세</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              {[['이름', selected.name], ['연락처', selected.phone], ['유형', selected.type], ['날짜', selected.date]].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ minWidth: '60px', color: '#888', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#141414' }}>{value}</span>
                </div>
              ))}
              <div>
                <p style={{ color: '#888', marginBottom: '8px' }}>문의 내용</p>
                <p style={{ backgroundColor: '#fafafa', padding: '14px', fontSize: '14px', lineHeight: 1.8, color: '#444', border: '1px solid #eee' }}>{selected.message}</p>
              </div>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
              <a href={`tel:${selected.phone}`} className="btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: '14px', padding: '12px' }}>전화하기</a>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '60px', textAlign: 'center', color: '#ccc' }}>
            <p>문의를 선택하면<br />내용이 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
