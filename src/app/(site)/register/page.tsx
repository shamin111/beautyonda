import Header from '@/components/layout/Header'
import RegisterClient from './RegisterClient'

export const metadata = {
  title: '강사 등록',
  description: '뷰티온다 강사로 등록하고 수강생과 연결되세요.',
}

export default function RegisterPage() {
  return (
    <>
      <Header variant="light" />
      <RegisterClient />
    </>
  )
}
