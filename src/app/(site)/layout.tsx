import Footer from '@/components/layout/Footer'
import FloatingBanner from '@/components/layout/FloatingBanner'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <FloatingBanner />
    </>
  )
}
