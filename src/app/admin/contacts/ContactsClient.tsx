'use client'

import { useState, useTransition } from 'react'
import { markAsRead, deleteContact } from './actions'

type Contact = {
  id: string; name: string; phone: string; type: string
  message: string; status: string; created_at: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ko-KR')
}

export default function ContactsClient({ initialData }: { initialData: Contact[] }) {
  const [data, setData] = useState(initialData)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [, startTransition] = useTransition()

  const handleSelect = (row: Contact) => {
    setSelected(row)
    if (row.status === 'unread') {
      setData(prev => prev.map(d => d.id === row.id ? { ...d, status: 'read' } : d))
      startTransition(() => markAsRead(row.id))
    }
  }

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id))
    if (selected?.id === id) setSelected(null)
    startTransition(() => deleteContact(id))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>문의 관리</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>접수된 문의 내역 확인 ({data.length}건)</p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
          {data.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#ccc' }}>문의가 없습니다</div>
          )}
          {data.map(row => (
            <div key={row.id}
              onClick={() => handleSelect(row)}
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                backgroundColor: selected?.id === row.id ? '#fff9f5' : '#fff',
                borderLeft: row.status === 'unread' ? '3px solid #5b0000' : '3px solid transparent',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {row.status === 'unread' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5b0000', display: 'inline-block' }} />}
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{row.name}</span>
                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#f5f5f5', color: '#555' }}>{row.type}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{formatDate(row.created_at)}</span>
              </div>
              <p style={{ fontSize: '14px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'sticky', top: '20px' }}>
        {selected ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>문의 상세</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              {[['이름', selected.name], ['연락처', selected.phone], ['유형', selected.type], ['날짜', formatDate(selected.created_at)]].map(([label, value]) => (
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
              <button onClick={() => handleDelete(selected.id)}
                style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, border: '1px solid #eee', backgroundColor: '#fff', color: '#888', cursor: 'pointer' }}>
                삭제
              </button>
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
