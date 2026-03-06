import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111', color: '#fff', padding: '60px 0 30px' }}>
      <div className="container">
        {/* Top */}
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '1.4px', marginBottom: '16px' }}>
              BEAUTY ONDA
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '280px' }}>
              국내 최초 뷰티강사 매칭 플랫폼<br />
              현업 전문가와 수강생을 연결합니다
            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>서비스</p>
              {[
                { href: '/instructors', label: '강사 찾기' },
                { href: '/match', label: '매칭 신청' },
                { href: '/register', label: '강사 등록' },
                { href: '/partner', label: '파트너 모집' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '16px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>회사</p>
              {[
                { href: '/about', label: '기업소개' },
                { href: '/news', label: '뉴스·이벤트' },
                { href: '/contact', label: '문의하기' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-bottom">
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Beauty ONDA. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { href: '/terms', label: '이용약관' },
              { href: '/privacy', label: '개인정보처리방침' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
