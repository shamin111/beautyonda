import Header from '@/components/layout/Header'

export const metadata = {
  title: '기업소개',
  description: '뷰티온다는 국내 최초 뷰티강사 매칭 플랫폼입니다.',
}

const BUSINESSES = [
  { icon: '🤝', title: '강사 매칭 플랫폼', desc: '현업 뷰티 전문가와 수강생을 연결하는 국내 최초 매칭 서비스. 헤어·메이크업·네일·피부관리 등 전 분야를 아우릅니다.' },
  { icon: '📚', title: '교육 과정 운영', desc: '실전 기반의 단계별 뷰티 교육 프로그램을 운영합니다. 입문부터 고급 심화 과정까지 체계적으로 구성되어 있습니다.' },
  { icon: '🏛️', title: '협회 운영', desc: '한국헤어스타일링 전문가 협회를 기반으로 업계 표준화와 전문가 네트워크 구축에 앞장섭니다.' },
  { icon: '🌐', title: '파트너 시스템', desc: '전국 지사·파트너를 통해 지역별 강사 매칭 서비스를 확대하고 있습니다.' },
]

const TIMELINE = [
  { year: '2024', event: '한국헤어스타일링 전문가 협회 설립' },
  { year: '2025. 01', event: '뷰티온다 서비스 기획 시작' },
  { year: '2025. 03', event: '뷰티온다 플랫폼 정식 런칭' },
  { year: '2025. 06', event: '강사 매칭 누적 100건 달성' },
]

export default function AboutPage() {
  return (
    <>
      <Header variant="light" />
      <main style={{}}>

        {/* 히어로 */}
        <section style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '100px 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '20px' }}>
              About Beauty ONDA
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 700, lineHeight: 1.2, marginBottom: '30px' }}>
              뷰티 교육의<br />새로운 연결
            </h1>
            <p style={{ fontSize: '20px', lineHeight: 1.8, opacity: 0.85, maxWidth: '600px' }}>
              고수가 중수를, 중수가 하수를 끌어올린다.<br />
              현업 전문가와 수강생이 만나는 뷰티온다입니다.
            </p>
          </div>
        </section>

        {/* 브랜드 철학 */}
        <section style={{ backgroundColor: 'var(--color-bg-cream)', padding: '100px 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <h2 className="section-title-sm" style={{ marginBottom: '30px' }}>
                  브랜드 철학
                </h2>
                <p style={{ fontSize: '18px', lineHeight: 2, color: '#444' }}>
                  뷰티온다는 <strong>현업 경력자의 실전 지식</strong>이 다음 세대에게 자연스럽게 전달되는 교육 생태계를 만듭니다.
                </p>
                <p style={{ fontSize: '18px', lineHeight: 2, color: '#444', marginTop: '16px' }}>
                  단순한 강의 매칭을 넘어, <strong>교육·레슨·취업까지 이어지는</strong> 뷰티 업계의 사다리 구조를 구현합니다.
                </p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '40px', border: '1px solid #e8d5c5' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--color-primary)', lineHeight: 1.5, fontWeight: 700 }}>
                  "고수가 중수를,<br />중수가 하수를<br />끌어올린다"
                </p>
                <p style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>— Beauty ONDA 슬로건</p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 사업 */}
        <section style={{ padding: '100px 0', backgroundColor: '#fff' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <h2 className="section-title-center" style={{ textAlign: 'center', marginBottom: '16px' }}>주요 사업</h2>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', marginBottom: '60px' }}>
              뷰티온다가 만들어가는 네 가지 서비스
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2px' }}>
              {BUSINESSES.map((b, i) => (
                <div
                  key={b.title}
                  style={{
                    padding: '50px 40px',
                    backgroundColor: i % 2 === 0 ? '#fff' : 'var(--color-bg-cream)',
                    border: '1px solid #f0e8e0',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '20px' }}>{b.icon}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px', color: '#141414' }}>{b.title}</h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section style={{ backgroundColor: '#111', color: '#fff', padding: '100px 0' }}>
          <div className="container" style={{ maxWidth: '700px' }}>
            <h2 className="section-title-center" style={{ textAlign: 'center', marginBottom: '60px', color: '#fff' }}>연혁</h2>
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              {/* 세로선 */}
              <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '40px' }}>
                  <div style={{ position: 'absolute', left: '-36px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '2px solid #fff' }} />
                  <p style={{ fontSize: '13px', fontFamily: 'var(--font-eng-bold)', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '1px' }}>{item.year}</p>
                  <p style={{ fontSize: '17px', fontWeight: 700 }}>{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ backgroundColor: 'var(--color-bg-cream)', padding: '80px 0', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>함께 성장하고 싶으신가요?</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '36px' }}>강사 등록, 파트너십, 협업 문의는 아래 버튼을 이용해주세요.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="btn-primary">강사 등록하기</a>
              <a href="/contact" className="btn-outline-dark">문의하기</a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
