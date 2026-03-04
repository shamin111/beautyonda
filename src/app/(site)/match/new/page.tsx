import Header from '@/components/layout/Header'
import MatchRequestClient from '../MatchRequestClient'

export const metadata = {
  title: '섭외문의 등록',
  description: '원하는 조건을 입력하면 맞춤 강사를 연결해드립니다.',
}

export default function MatchNewPage() {
  return (
    <>
      <Header variant="light" />
      <MatchRequestClient />
    </>
  )
}
