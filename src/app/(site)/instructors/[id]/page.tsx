import Header from '@/components/layout/Header'
import InstructorDetailClient from './InstructorDetailClient'

export const metadata = {
  title: '강사 프로필',
}

export default function InstructorDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header variant="light" />
      <InstructorDetailClient id={params.id} />
    </>
  )
}
