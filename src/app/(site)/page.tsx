import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import QuickMenuSection from '@/components/sections/QuickMenuSection'
import InstructorsSection from '@/components/sections/InstructorsSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import NewsSection from '@/components/sections/NewsSection'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickMenuSection />
      <StatsSection />
      <InstructorsSection />
      <HowItWorksSection />
      <NewsSection />
      <ContactSection />
    </>
  )
}
