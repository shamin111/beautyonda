import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '뷰티온다 | 국내 최초 뷰티강사 매칭 플랫폼',
    template: '%s | 뷰티온다',
  },
  description: '현업 뷰티 전문가와 수강생을 연결하는 강사 매칭 플랫폼. 헤어, 메이크업, 네일, 피부관리, 웨딩까지 전문 강사를 만나보세요.',
  keywords: ['뷰티강사', '강사매칭', '헤어강사', '메이크업강사', '네일강사', '뷰티레슨', '뷰티교육'],
  openGraph: {
    siteName: '뷰티온다',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
