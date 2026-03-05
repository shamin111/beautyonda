import { getInstructors } from './actions'
import InstructorsClient from './InstructorsClient'

export default async function AdminInstructorsPage() {
  const raw = await getInstructors()

  // DB 컬럼을 admin UI 형식으로 매핑
  const data = raw.map((r: Record<string, unknown>) => ({
    id: String(r.id),
    name: String(r.name ?? ''),
    phone: String(r.phone ?? ''),
    field: Array.isArray(r.fields) ? (r.fields as string[])[0] ?? '' : String(r.fields ?? ''),
    region: String(r.region ?? ''),
    career: r.career_years ? `${r.career_years}년` : '',
    price: r.price_min ? `${Number(r.price_min) / 10000}만원~` : '',
    method: String(r.lesson_method ?? 'offline'),
    status: r.is_approved ? 'approved' : (r.is_active ? 'pending' : 'rejected'),
    date: new Date(String(r.created_at)).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, ''),
    photo: String(r.profile_image ?? ''),
    intro: String(r.bio ?? ''),
    subjects: Array.isArray(r.signature_style) ? (r.signature_style as string[]).join(' / ') : '',
    sns: String(r.instagram_url ?? ''),
    source: 'apply' as const,
  }))

  return <InstructorsClient initialData={data} />
}
