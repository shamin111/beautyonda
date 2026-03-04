-- ══════════════════════════════════════════════════
-- 뷰티온다 강사매칭 플랫폼 Supabase Schema
-- Supabase SQL Editor에 붙여넣기 후 실행
-- ══════════════════════════════════════════════════

-- UUID 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────
-- 1. 강사 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  role             TEXT,                        -- 대표, 아티스트, 강사 등
  company          TEXT,                        -- 소속 기관
  fields           TEXT[] NOT NULL DEFAULT '{}', -- 헤어, 메이크업 등 배열
  region           TEXT NOT NULL,              -- 활동 지역
  career_years     INT DEFAULT 0,
  lesson_method    TEXT DEFAULT 'offline',     -- offline | online | both
  price_min        INT DEFAULT 0,
  price_max        INT DEFAULT 0,
  bio              TEXT,
  signature_style  TEXT[] DEFAULT '{}',
  certifications   TEXT[] DEFAULT '{}',
  portfolio_images TEXT[] DEFAULT '{}',        -- Supabase Storage URL 배열
  youtube_url      TEXT,
  instagram_url    TEXT,
  profile_image    TEXT,                       -- Supabase Storage URL
  grade            TEXT DEFAULT 'new',         -- new | standard | pro | top
  rating           NUMERIC(3,2) DEFAULT 0,
  review_count     INT DEFAULT 0,
  match_count      INT DEFAULT 0,
  response_rate    INT DEFAULT 0,              -- 0~100
  is_active        BOOLEAN DEFAULT true,
  is_approved      BOOLEAN DEFAULT false,      -- 관리자 승인 필요
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 2. 매칭 신청 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS match_requests (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- 신청자 정보
  applicant_name        TEXT NOT NULL,
  applicant_phone       TEXT NOT NULL,
  applicant_region      TEXT NOT NULL,
  -- 레슨 조건
  fields                TEXT[] NOT NULL DEFAULT '{}',
  lesson_method         TEXT DEFAULT 'offline',
  level                 TEXT DEFAULT 'beginner', -- beginner | elementary | intermediate | advanced
  price_range           TEXT,                    -- 0-50000 | 50000-100000 | 100000-200000 | 200000+
  -- 상세 요청
  purposes              TEXT[] DEFAULT '{}',     -- hobby | certificate | job | private | startup
  preferred_date        DATE,
  message               TEXT,
  -- 매칭 결과
  status                TEXT DEFAULT 'pending',  -- pending | matched | in_progress | completed | cancelled
  matched_instructor_id UUID REFERENCES instructors(id),
  admin_memo            TEXT,                    -- 관리자 메모
  -- 메타
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 3. 리뷰 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id    UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  match_request_id UUID REFERENCES match_requests(id),
  author_name      TEXT NOT NULL,
  rating           INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content          TEXT NOT NULL,
  is_visible       BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 4. 뉴스·공지 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category      TEXT DEFAULT '공지사항',  -- 공지사항 | 이벤트 | 오픈클래스 | 협회소식 | 컨테스트
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  thumbnail_url TEXT,
  is_published  BOOLEAN DEFAULT false,
  view_count    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 5. 강사 등록 신청 테이블 (심사 전)
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructor_applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  region            TEXT NOT NULL,
  fields            TEXT[] NOT NULL DEFAULT '{}',
  career            TEXT,
  lesson_method     TEXT,
  price_min         INT,
  price_max         INT,
  bio               TEXT,
  certifications    TEXT,
  instagram_url     TEXT,
  youtube_url       TEXT,
  portfolio_images  TEXT[] DEFAULT '{}',
  status            TEXT DEFAULT 'pending', -- pending | approved | rejected
  admin_memo        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 6. 문의 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  role       TEXT,
  phone      TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 7. 메인 배너 테이블
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT,
  subtitle    TEXT,
  image_url   TEXT,
  link_url    TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  click_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- 트리거: updated_at 자동 갱신
-- ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_match_requests_updated_at
  BEFORE UPDATE ON match_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────
-- 트리거: 리뷰 작성 시 강사 평점·리뷰 수 자동 갱신
-- ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_instructor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE instructors
  SET
    rating       = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews WHERE instructor_id = NEW.instructor_id AND is_visible = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE instructor_id = NEW.instructor_id AND is_visible = true)
  WHERE id = NEW.instructor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_instructor_rating();

-- ──────────────────────────────────────────────────
-- RLS (Row Level Security)
-- ──────────────────────────────────────────────────
ALTER TABLE instructors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners              ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 (승인된 강사 + 발행된 뉴스 + 배너)
CREATE POLICY "public_read_instructors" ON instructors
  FOR SELECT USING (is_approved = true AND is_active = true);

CREATE POLICY "public_read_news" ON news
  FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_reviews" ON reviews
  FOR SELECT USING (is_visible = true);

-- 누구나 매칭 신청·문의·강사 등록 신청 가능
CREATE POLICY "public_insert_match" ON match_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_insert_contact" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_insert_application" ON instructor_applications
  FOR INSERT WITH CHECK (true);

-- 누구나 리뷰 작성 가능
CREATE POLICY "public_insert_review" ON reviews
  FOR INSERT WITH CHECK (true);

-- ──────────────────────────────────────────────────
-- 인덱스
-- ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_instructors_fields  ON instructors USING GIN(fields);
CREATE INDEX IF NOT EXISTS idx_instructors_region  ON instructors(region);
CREATE INDEX IF NOT EXISTS idx_instructors_grade   ON instructors(grade);
CREATE INDEX IF NOT EXISTS idx_match_status        ON match_requests(status);
CREATE INDEX IF NOT EXISTS idx_news_category       ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published      ON news(is_published, created_at DESC);

-- ──────────────────────────────────────────────────
-- 샘플 데이터 (선택 — 테스트용)
-- ──────────────────────────────────────────────────
INSERT INTO instructors (name, role, company, fields, region, career_years, lesson_method, price_min, price_max, bio, grade, rating, review_count, match_count, response_rate, is_approved)
VALUES
  ('이지연', '대표', '아이엠밸리', ARRAY['헤어','업스타일'], '서울', 10, 'offline', 80000, 150000, '현업 10년차 헤어 아티스트', 'top', 4.9, 32, 47, 98, true),
  ('박소연', '아티스트', '스타일리스트', ARRAY['메이크업','웨딩'], '서울', 7, 'offline', 60000, 120000, '웨딩·방송 메이크업 전문', 'pro', 4.8, 24, 32, 95, true),
  ('김민지', '강사', '뷰티아카데미', ARRAY['네일'], '서울', 5, 'online', 40000, 80000, '네일 아트 전문 강사', 'pro', 4.7, 18, 21, 90, true),
  ('최현아', '원장', '뷰티스튜디오', ARRAY['피부관리','스킨케어'], '경기', 12, 'offline', 100000, 200000, '피부관리 12년 경력', 'top', 5.0, 41, 58, 99, true);

INSERT INTO banners (title, subtitle, image_url, sort_order, is_active)
VALUES
  ('고수가 중수를, 중수가 하수를 끌어올린다', '현업 경력자가 다음 단계를 이끄는 뷰티 클래스', null, 1, true),
  ('뷰티의 모든 분야 선생님 찾기는 뷰티온다!', '헤어부터 스킨케어까지 전문 강사를 만나보세요', null, 2, true);
