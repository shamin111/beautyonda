export const metadata = { title: '관리자 대시보드 | 뷰티온다' }

const STATS = [
  { label: '오늘 매칭 신청', value: '3', unit: '건', color: '#5b0000', bg: '#fff5ed' },
  { label: '강사 심사 대기', value: '7', unit: '명', color: '#1a5b00', bg: '#f0fff0' },
  { label: '이번달 매칭 완료', value: '24', unit: '건', color: '#00305b', bg: '#f0f5ff' },
  { label: '전체 등록 강사', value: '52', unit: '명', color: '#333', bg: '#f5f5f5' },
]

const RECENT_MATCHES = [
  { id: 'M001', name: '김수진', fields: '헤어', region: '서울', status: 'pending', date: '2025.03.05' },
  { id: 'M002', name: '이민호', fields: '메이크업', region: '경기', status: 'matched', date: '2025.03.04' },
  { id: 'M003', name: '박지현', fields: '네일', region: '서울', status: 'completed', date: '2025.03.03' },
  { id: 'M004', name: '최영수', fields: '피부관리', region: '부산', status: 'pending', date: '2025.03.03' },
]

const RECENT_APPLICATIONS = [
  { id: 'A001', name: '한미래', field: '헤어', region: '서울', date: '2025.03.05', status: 'pending' },
  { id: 'A002', name: '정소희', field: '웨딩', region: '경기', date: '2025.03.04', status: 'pending' },
  { id: 'A003', name: '오지훈', field: '메이크업', region: '인천', date: '2025.03.02', status: 'approved' },
]

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: '대기', color: '#92400e', bg: '#fef3c7' },
  matched:    { label: '매칭됨', color: '#1e40af', bg: '#dbeafe' },
  in_progress:{ label: '진행중', color: '#065f46', bg: '#d1fae5' },
  completed:  { label: '완료', color: '#374151', bg: '#f3f4f6' },
  cancelled:  { label: '취소', color: '#991b1b', bg: '#fee2e2' },
  approved:   { label: '승인', color: '#065f46', bg: '#d1fae5' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, color: '#555', bg: '#eee' }
  return (
    <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color, borderRadius: '2px' }}>
      {s.label}
    </span>
  )
}

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>대시보드</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>2025년 3월 5일 기준</p>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ backgroundColor: s.bg, padding: '24px', border: `1px solid ${s.color}20` }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{s.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-eng-bold)' }}>{s.value}</span>
              <span style={{ fontSize: '14px', color: '#888' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 최근 매칭 신청 */}
        <div style={{ backgroundColor: '#fff', padding: '24px', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800 }}>최근 매칭 신청</h2>
            <a href="/admin/matches" style={{ fontSize: '13px', color: '#5b0000', fontWeight: 600 }}>전체 보기 →</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['신청자', '분야', '지역', '상태', '날짜'].map(h => (
                  <th key={h} style={{ padding: '8px 6px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_MATCHES.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 6px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '12px 6px', color: '#555' }}>{m.fields}</td>
                  <td style={{ padding: '12px 6px', color: '#555' }}>{m.region}</td>
                  <td style={{ padding: '12px 6px' }}><StatusBadge status={m.status} /></td>
                  <td style={{ padding: '12px 6px', color: '#aaa', fontSize: '13px' }}>{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 강사 등록 신청 */}
        <div style={{ backgroundColor: '#fff', padding: '24px', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800 }}>강사 등록 신청</h2>
            <a href="/admin/instructors" style={{ fontSize: '13px', color: '#5b0000', fontWeight: 600 }}>전체 보기 →</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['이름', '분야', '지역', '상태', '신청일'].map(h => (
                  <th key={h} style={{ padding: '8px 6px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_APPLICATIONS.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 6px', fontWeight: 600 }}>{a.name}</td>
                  <td style={{ padding: '12px 6px', color: '#555' }}>{a.field}</td>
                  <td style={{ padding: '12px 6px', color: '#555' }}>{a.region}</td>
                  <td style={{ padding: '12px 6px' }}><StatusBadge status={a.status} /></td>
                  <td style={{ padding: '12px 6px', color: '#aaa', fontSize: '13px' }}>{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { href: '/admin/instructors', label: '강사 승인하기', icon: '✅' },
          { href: '/admin/matches', label: '매칭 처리하기', icon: '🔗' },
          { href: '/admin/notices', label: '공지 등록하기', icon: '📝' },
          { href: '/admin/banners', label: '배너 수정하기', icon: '🖼️' },
        ].map(m => (
          <a
            key={m.href}
            href={m.href}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #eee',
              padding: '20px',
              textAlign: 'center',
              display: 'block',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.icon}</div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#141414' }}>{m.label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
