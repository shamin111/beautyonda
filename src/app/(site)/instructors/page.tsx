import Header from '@/components/layout/Header'
import InstructorListClient from './InstructorListClient'

export const metadata = {
  title: '강사 찾기',
  description: '뷰티온다에 등록된 검증된 강사를 분야, 지역, 가격대별로 찾아보세요.',
}

export default function InstructorsPage() {
  return (
    <>
      <Header variant="light" />
      <InstructorListClient />
    </>
  )
}
