import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MypageClient from './MypageClient'

export const metadata = { title: '마이페이지 | 뷰티온다' }

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/mypage')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: myMatches } = await supabase
    .from('match_requests')
    .select('id, title, category, status, created_at, location_si')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: myApplication } = await supabase
    .from('instructor_applications')
    .select('id, name, fields, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <MypageClient
      user={{ id: user.id, email: user.email ?? '' }}
      profile={profile}
      myMatches={myMatches ?? []}
      myApplication={myApplication ?? null}
    />
  )
}
