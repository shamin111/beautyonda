import Link from 'next/link'

const MOCK_NEWS = [
  { id: '1', category: '공지사항', title: '뷰티온다 서비스 정식 런칭 안내', date: '2025.03.01', summary: '뷰티온다가 드디어 정식 서비스를 시작합니다.' },
  { id: '2', category: '오픈클래스', title: '3월 헤어 업스타일 오픈클래스 모집', date: '2025.02.25', summary: '현업 아티스트와 함께하는 업스타일 특강에 참여하세요.' },
  { id: '3', category: '이벤트', title: '강사 등록 선착순 혜택 안내', date: '2025.02.20', summary: '선착순 50명 강사에게 프리미엄 노출 혜택을 제공합니다.' },
]

const CATEGORY_COLOR: Record<string, string> = {
  '공지사항': '#5b0000',
  '오픈클래스': '#1a5b00',
  '이벤트': '#00305b',
  '협회소식': '#5b3800',
  '컨테스트': '#3b005b',
}

export default function NewsSection() {
  return (
    <section style={{ backgroundColor: 'var(--color-bg-light)', padding: '100px 0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '60px',
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <div>
            <h2 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.3, color: '#141414', marginBottom: '20px' }}>
              뉴스 &<br />이벤트
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#555', marginBottom: '40px' }}>
              뷰티온다의 최신 소식과<br />
              오픈클래스·특강 일정을 확인하세요.
            </p>
            <Link href="/news" style={{ fontWeight: 700, fontSize: '15px', textDecoration: 'underline', color: '#000' }}>
              MORE →
            </Link>
          </div>

          {/* Right — Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {MOCK_NEWS.map(news => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                style={{ display: 'block' }}
              >
                <div
                  className="news-card"
                  style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px' }}
                >
                  {/* 카테고리 배지 */}
                  <span
                    style={{
                      flexShrink: 0,
                      backgroundColor: CATEGORY_COLOR[news.category] ?? '#333',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      marginTop: '3px',
                    }}
                  >
                    {news.category}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#141414', marginBottom: '8px' }}>
                      {news.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>{news.summary}</p>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: '13px', color: '#aaa' }}>{news.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
