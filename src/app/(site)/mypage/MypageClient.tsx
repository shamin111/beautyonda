'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, MatchStatus } from '@/types'

interface MyMatch {
  id: string
  title: string
  category: string
  status: MatchStatus
  created_at: string
  location_si: string
}

interface MyApplication {
  id: string
  name: string
  fields: string[]
  status: string
  created_at: string
}

interface Props {
  user: { id: string; email: string }
  profile: Profile | null
  myMatches: MyMatch[]
  myApplication: MyApplication | null
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: '대기중', color: '#92400e', bg: '#fef3c7' },
  matched:     { label: '매칭됨', color: '#1e40af', bg: '#dbeafe' },
  in_progress: { label: '진행중', color: '#065f46', bg: '#d1fae5' },
  completed:   { label: '완료',   color: '#374151', bg: '#f3f4f6' },
  cancelled:   { label: '취소',   color: '#991b1b', bg: '#fee2e2' },
  approved:    { label: '승인',   color: '#065f46', bg: '#d1fae5' },
  rejected:    { label: '반려',   color: '#991b1b', bg: '#fee2e2' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, color: '#555', bg: '#eee' }
  return (
    <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: 700, backgroundColor: s.bg, color: s.color, borderRadius: '2px' }}>
      {s.label}
    </span>
  )
}

export default function MypageClient({ user, profile, myMatches, myApplication }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'info' | 'matches' | 'instructor'>('info')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: profile?.name ?? '', phone: profile?.phone ?? '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const role = profile?.role ?? 'student'
  const isInstructor = role === 'instructor'
  const isAdmin = role === 'admin'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: form.name, phone: form.phone, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setSaveMsg('저장 중 오류가 발생했습니다.')
    } else {
      setSaveMsg('저장됐습니다.')
      setEditMode(false)
      setTimeout(() => setSaveMsg(''), 3000)
      router.refresh()
    }
  }

  const tabs = [
    { id: 'info', label: '내 정보' },
    { id: 'matches', label: '매칭 신청 내역' },
    ...(isInstructor ? [{ id: 'instructor', label: '강사 등록 현황' }] : []),
  ] as { id: 'info' | 'matches' | 'instructor'; label: string }[]

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: editMode ? '#fff' : '#fafafa',
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#141414', marginBottom: '6px' }}>마이페이지</h1>
            <p style={{ fontSize: '14px', color: '#888' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isAdmin && (
              <Link
                href="/admin"
                style={{ padding: '8px 20px', backgroundColor: '#5b0000', color: '#fff', fontSize: '14px', fontWeight: 700 }}
              >
                관리자 페이지
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{ padding: '8px 20px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#555' }}
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 프로필 카드 */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '28px 32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#5b0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px', fontWeight: 800, flexShrink: 0 }}>
            {(profile?.name ?? user.email)?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#141414', marginBottom: '4px' }}>
              {profile?.name ?? '이름 미설정'}
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#fff', backgroundColor: role === 'admin' ? '#5b0000' : role === 'instructor' ? '#1e40af' : '#555', padding: '2px 10px', fontWeight: 700 }}>
                {role === 'admin' ? '관리자' : role === 'instructor' ? '강사' : '수강생'}
              </span>
              {profile?.phone && (
                <span style={{ fontSize: '14px', color: '#888' }}>{profile.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#5b0000' : '#888',
                borderBottom: activeTab === tab.id ? '2px solid #5b0000' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'info' && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>기본 정보</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  style={{ padding: '8px 20px', border: '1px solid #5b0000', color: '#5b0000', fontSize: '14px', fontWeight: 700, cursor: 'pointer', background: 'none' }}
                >
                  수정하기
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { setEditMode(false); setForm({ name: profile?.name ?? '', phone: profile?.phone ?? '' }) }}
                    style={{ padding: '8px 20px', border: '1px solid #ddd', color: '#555', fontSize: '14px', fontWeight: 700, cursor: 'pointer', background: 'none' }}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '8px 20px', backgroundColor: '#5b0000', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                  >
                    {saving ? '저장 중...' : '저장'}
                  </button>
                </div>
              )}
            </div>

            {saveMsg && (
              <div style={{ padding: '12px 16px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '14px', marginBottom: '20px', border: '1px solid #a7f3d0' }}>
                {saveMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>이름</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  disabled={!editMode}
                  placeholder="이름을 입력하세요"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>연락처</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  disabled={!editMode}
                  placeholder="010-0000-0000"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>이메일</label>
                <input value={user.email} disabled style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#aaa' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>회원 유형</label>
                <input
                  value={role === 'admin' ? '관리자' : role === 'instructor' ? '강사' : '수강생'}
                  disabled
                  style={{ ...inputStyle, backgroundColor: '#f5f5f5', color: '#aaa' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>매칭 신청 내역</h2>
              <Link
                href="/match/new"
                style={{ padding: '8px 20px', backgroundColor: '#5b0000', color: '#fff', fontSize: '14px', fontWeight: 700 }}
              >
                + 새 신청
              </Link>
            </div>

            {myMatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                <p style={{ fontSize: '40px', marginBottom: '16px' }}>📋</p>
                <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>아직 신청 내역이 없습니다</p>
                <p style={{ fontSize: '14px' }}>원하는 강사를 찾아 매칭 신청을 해보세요</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    {['제목', '분야', '지역', '상태', '신청일'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#888' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myMatches.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 600, color: '#141414' }}>
                        <Link href={`/match/${m.id}`} style={{ color: 'inherit' }}>{m.title}</Link>
                      </td>
                      <td style={{ padding: '14px 8px', color: '#555' }}>{m.category}</td>
                      <td style={{ padding: '14px 8px', color: '#555' }}>{m.location_si}</td>
                      <td style={{ padding: '14px 8px' }}><StatusBadge status={m.status} /></td>
                      <td style={{ padding: '14px 8px', color: '#aaa', fontSize: '13px' }}>{m.created_at.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'instructor' && isInstructor && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>강사 등록 현황</h2>

            {!myApplication ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
                <p style={{ fontSize: '40px', marginBottom: '16px' }}>📝</p>
                <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>강사 등록 신청 내역이 없습니다</p>
                <Link href="/register" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                  강사 등록 신청하기
                </Link>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ padding: '20px', border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <p style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>심사 상태</p>
                    <StatusBadge status={myApplication.status} />
                  </div>
                  <div style={{ padding: '20px', border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <p style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>신청일</p>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{myApplication.created_at.slice(0, 10)}</p>
                  </div>
                  <div style={{ padding: '20px', border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <p style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>이름</p>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{myApplication.name}</p>
                  </div>
                  <div style={{ padding: '20px', border: '1px solid #eee', backgroundColor: '#fafafa' }}>
                    <p style={{ fontSize: '12px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>활동 분야</p>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>{myApplication.fields?.join(', ')}</p>
                  </div>
                </div>

                {myApplication.status === 'pending' && (
                  <div style={{ padding: '16px 20px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', fontSize: '14px', color: '#92400e' }}>
                    심사가 진행 중입니다. 승인까지 영업일 기준 3~5일이 소요됩니다.
                  </div>
                )}
                {myApplication.status === 'approved' && (
                  <div style={{ padding: '16px 20px', backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', fontSize: '14px', color: '#065f46' }}>
                    강사 등록이 승인됐습니다. 강사 프로필 페이지에서 확인하세요.
                  </div>
                )}
                {myApplication.status === 'rejected' && (
                  <div style={{ padding: '16px 20px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', fontSize: '14px', color: '#991b1b' }}>
                    등록이 반려됐습니다. 자세한 사유는 이메일을 확인해주세요.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
