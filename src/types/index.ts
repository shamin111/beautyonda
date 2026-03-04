// ─── Instructor ───────────────────────────────────
export type InstructorGrade = 'new' | 'standard' | 'pro' | 'top'

export type LessonMethod = 'offline' | 'online' | 'both'

export interface Instructor {
  id: string
  name: string
  role: string           // e.g. "헤어 아티스트"
  company: string        // 소속 or 활동 기관
  fields: string[]       // e.g. ["헤어", "업스타일"]
  region: string         // e.g. "서울 강남"
  career_years: number
  lesson_method: LessonMethod
  price_min: number
  price_max: number
  bio: string
  signature_style: string[]
  certifications: string[]
  portfolio_images: string[]
  youtube_url?: string
  instagram_url?: string
  profile_image: string
  grade: InstructorGrade
  rating: number
  review_count: number
  match_count: number
  response_rate: number  // 0~100
  is_active: boolean
  is_approved: boolean
  created_at: string
}

// ─── Match Request ────────────────────────────────
export type MatchStatus = 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
export type LectureType = '출강강의' | '온라인강의' | '클래스운영' | '기타'

export interface MatchRequest {
  id: string
  // 공개 게시 정보
  category: string       // e.g. "헤어", "메이크업"
  title: string          // 섭외 제목
  location_si: string    // e.g. "서울"
  location_gu?: string   // e.g. "은평구"
  preferred_date?: string
  lecture_type: LectureType
  description: string
  budget?: string
  is_published: boolean
  // 신청자 정보 (비공개)
  contact_name: string
  contact_phone: string
  // 매칭 결과
  status: MatchStatus
  matched_instructor_id?: string
  // 메타
  created_at: string
  updated_at: string
}

// ─── Review ───────────────────────────────────────
export interface Review {
  id: string
  instructor_id: string
  match_request_id: string
  author_name: string
  rating: number         // 1~5
  content: string
  created_at: string
}

// ─── News ─────────────────────────────────────────
export type NewsCategory = '공지사항' | '이벤트' | '오픈클래스' | '협회소식' | '컨테스트'

export interface News {
  id: string
  category: NewsCategory
  title: string
  content: string
  thumbnail_url?: string
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

// ─── Instructor Register Form ─────────────────────
export interface InstructorRegisterForm {
  name: string
  phone: string
  region: string
  fields: string[]
  career_years: number
  lesson_method: LessonMethod
  price_min: number
  price_max: number
  bio: string
  certifications: string
  instagram_url: string
  youtube_url: string
  agree: boolean
}

// ─── Profile ──────────────────────────────────────
export type UserRole = 'student' | 'instructor' | 'admin'

export interface Profile {
  id: string
  name: string | null
  role: UserRole
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// ─── Filter ───────────────────────────────────────
export interface InstructorFilter {
  fields: string[]
  region: string
  lesson_method: string
  career_years: string
  price_range: string
  sort: 'recommended' | 'rating' | 'latest' | 'price_asc'
}
