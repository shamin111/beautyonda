import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import QuickMenuSection from '@/components/sections/QuickMenuSection'
import InstructorsSection from '@/components/sections/InstructorsSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import NewsSection from '@/components/sections/NewsSection'
import ContactSection from '@/components/sections/ContactSection'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: instructors }, { data: news }, { data: banners }] = await Promise.all([
    supabase
      .from('instructors')
      .select('id, name, role, company, fields, region, rating, match_count, grade, profile_image')
      .eq('is_active', true)
      .eq('is_approved', true)
      .order('match_count', { ascending: false })
      .limit(6),
    supabase
      .from('news')
      .select('id, category, title, content, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('banners')
      .select('title, subtitle, image_url, link_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <>
      <Header />
      <HeroSection slides={banners ?? []} />
      <QuickMenuSection />
      <StatsSection />
      <InstructorsSection initialData={instructors ?? []} />
      <HowItWorksSection />
      <NewsSection news={news ?? []} />
      <ContactSection />
    </>
  )
}
