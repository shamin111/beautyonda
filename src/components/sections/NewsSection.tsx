import Link from 'next/link'

type NewsItem = {
  id: string
  category: string
  title: string
  content: string
  created_at: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '.').replace(/\.$/, '')
}

const CATEGORY_COLOR: Record<string, string> = {
  '공지사항': '#5b0000',
  '오픈클래스': '#1a5b00',
  '이벤트': '#00305b',
  '협회소식': '#5b3800',
  '컨테스트': '#3b005b',
}

export default function NewsSection({ news }: { news: NewsItem[] }) {
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
            {news.map(item => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                style={{ display: 'block' }}
              >
                <div
                  className="news-card"
                  style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px' }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      backgroundColor: CATEGORY_COLOR[item.category] ?? '#333',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      marginTop: '3px',
                    }}
                  >
                    {item.category}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#141414', marginBottom: '8px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
                      {item.content.replace(/\n/g, ' ').slice(0, 80)}...
                    </p>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: '13px', color: '#aaa' }}>{formatDate(item.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
