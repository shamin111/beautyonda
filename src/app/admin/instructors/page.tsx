import { getInstructors } from './actions'
import InstructorsClient, { type Instructor } from './InstructorsClient'

export default async function AdminInstructorsPage() {
  const raw = await getInstructors()

  const data: Instructor[] = raw.map((r: Record<string, unknown>) => ({
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    role: String(r.role ?? ''),
    company: String(r.company ?? ''),
    phone: String(r.phone ?? ''),
    region: String(r.region ?? ''),
    fields: Array.isArray(r.fields) ? r.fields as string[] : [],
    career_years: Number(r.career_years ?? 0),
    price_min: Number(r.price_min ?? 0),
    lesson_method: String(r.lesson_method ?? 'offline'),
    bio: String(r.bio ?? ''),
    signature_style: Array.isArray(r.signature_style) ? r.signature_style as string[] : [],
    certifications: Array.isArray(r.certifications) ? r.certifications as string[] : [],
    instagram_url: String(r.instagram_url ?? ''),
    youtube_url: String(r.youtube_url ?? ''),
    profile_image: String(r.profile_image ?? ''),
    portfolio_images: Array.isArray(r.portfolio_images) ? r.portfolio_images as string[] : [],
    grade: String(r.grade ?? 'new'),
    is_approved: Boolean(r.is_approved),
    is_active: Boolean(r.is_active),
    rating: Number(r.rating ?? 0),
    match_count: Number(r.match_count ?? 0),
    created_at: String(r.created_at ?? ''),
  }))

  return <InstructorsClient initialData={data} />
}
