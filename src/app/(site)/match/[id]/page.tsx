import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'

// TODO: Supabase 연동 후 실제 DB 조회로 교체
async function getMatchRequest(id: string) {
  // 임시 mock - 나중에 Supabase로 교체
  const items = [
    {
      id: '1', category: '헤어', title: '헤어 전문 강사 섭외 문의 (입문반 운영)',
      location_si: '서울', location_gu: '은평구', preferred_date: '2026-04-07',
      lecture_type: '출강강의', description: '헤어 입문 과정 클래스 강사를 찾고 있습니다. 주 2회, 약 2개월 과정입니다.\n\n수강 대상은 미용 입문자로 기초 커트, 염색, 펌 등 기본 기술을 가르쳐 주실 수 있는 분을 찾습니다.',
      budget: '협의 가능', created_at: new Date().toISOString(),
    },
    {
      id: '2', category: '메이크업', title: '[VIP] 백화점 키즈 브랜드 주관 부모대상 메이크업 강의',
      location_si: '광주', location_gu: '서구', preferred_date: '2026-03-25',
      lecture_type: '출강강의', description: '백화점 문화센터에서 진행할 부모 대상 메이크업 원데이 클래스 강사를 구합니다.\n\n총 2시간 분량의 기초 메이크업 강의로, VIP 행사에 어울리는 격식 있는 진행을 원합니다.',
      budget: '50~100만원', created_at: new Date().toISOString(),
    },
  ]
  return items.find(i => i.id === id) ?? null
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getMatchRequest(id)
  if (!item) notFound()

  const CATEGORY_COLOR: Record<string, string> = {
    '헤어': '#1a4b8c', '메이크업': '#8c1a5b', '네일': '#8c5b1a',
    '피부관리': '#1a8c4b', '웨딩/업스타일': '#5b1a8c', '퍼스널컬러': '#8c3d1a',
    'SMP': '#1a7a8c', '붙임머리': '#3d8c1a', '기타': '#555',
  }

  return (
    <>
      <Header variant="light" />
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <div className="container" style={{ maxWidth: '800px', paddingTop: '50px', paddingBottom: '80px' }}>

          {/* 뒤로가기 */}
          <Link href="/match" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#888', marginBottom: '32px' }}>
            ← 목록으로
          </Link>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '48px' }}>
            {/* 카테고리 + 유형 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '5px 14px', fontSize: '13px', fontWeight: 700,
                color: CATEGORY_COLOR[item.category] ?? '#333',
                border: `1px solid ${CATEGORY_COLOR[item.category] ?? '#333'}`,
              }}>
                {item.category}
              </span>
              <span style={{
                padding: '5px 14px', fontSize: '13px', fontWeight: 700,
                backgroundColor: '#5b0000', color: '#fff',
              }}>
                {item.lecture_type}
              </span>
            </div>

            {/* 제목 */}
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#141414', marginBottom: '28px', lineHeight: 1.4 }}>
              {item.title}
            </h1>

            {/* 기본 정보 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
              backgroundColor: '#fafafa', padding: '24px', marginBottom: '32px',
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>지역</p>
                <p style={{ fontSize: '15px', fontWeight: 700 }}>📍 {item.location_si}{item.location_gu ? ` ${item.location_gu}` : ''}</p>
              </div>
              {item.preferred_date && (
                <div>
                  <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>희망 일정</p>
                  <p style={{ fontSize: '15px', fontWeight: 700 }}>
                    📅 {new Date(item.preferred_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
              {item.budget && (
                <div>
                  <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>예산</p>
                  <p style={{ fontSize: '15px', fontWeight: 700 }}>💰 {item.budget}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>등록일</p>
                <p style={{ fontSize: '15px', fontWeight: 700 }}>
                  {new Date(item.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>

            {/* 상세 내용 */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #141414' }}>
                상세 내용
              </h2>
              <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {item.description}
              </p>
            </div>

            {/* 문의 버튼 */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/match/new"
                className="btn-primary"
                style={{ padding: '16px 40px', fontSize: '16px', fontWeight: 700 }}
              >
                나도 섭외문의 등록하기
              </Link>
              <Link
                href="/instructors"
                style={{
                  padding: '16px 40px', fontSize: '16px', fontWeight: 700,
                  border: '2px solid #141414', color: '#141414',
                  display: 'inline-block',
                }}
              >
                강사 찾아보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
