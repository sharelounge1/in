# 데이터베이스 스키마 설계서

**프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
**DB**: Supabase (PostgreSQL)
**문서 버전**: 1.0
**작성일**: 2025-01-18

---

> **관련 문서**
> - [전체 사이트 구조](./PROJECT_STRUCTURE.md)
> - [DB 현황](./DB_STATUS.md)
> - [API 명세서](./API_SPECIFICATION.md)
> - [백엔드 설정 가이드](./BACKEND_SETUP_GUIDE.md)

---

## 1. ERD 개요

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────▶│  profiles   │     │influencers  │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                        │
       │     ┌─────────────────────────────────┤
       │     │                                  │
       ▼     ▼                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  courses    │◀────│course_days  │     │   parties   │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                        │
       │                                        │
       ▼                                        ▼
┌─────────────┐                         ┌─────────────┐
│course_apps  │                         │ party_apps  │
└──────┬──────┘                         └──────┬──────┘
       │                                        │
       │     ┌─────────────┐                    │
       └────▶│  payments   │◀───────────────────┘
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │ settlements │
             └─────────────┘
```

---

## 2. 테이블 정의

### 2.1 사용자 관련

#### users (Supabase Auth 확장)
```sql
-- Supabase Auth의 auth.users 테이블을 기반으로 확장
-- 기본 인증 정보는 auth.users에서 관리

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),                    -- 본인인증된 전화번호
    phone_verified BOOLEAN DEFAULT FALSE, -- 본인인증 완료 여부
    name VARCHAR(100),                    -- 실명
    nickname VARCHAR(50),                 -- 닉네임
    avatar_url TEXT,                      -- 프로필 이미지
    instagram_url VARCHAR(255),           -- 인스타그램 링크
    gender VARCHAR(10),                   -- male, female, other
    birth_date DATE,                      -- 생년월일
    bio TEXT,                             -- 자기소개
    role VARCHAR(20) DEFAULT 'user',      -- user, influencer, admin
    status VARCHAR(20) DEFAULT 'active',  -- active, suspended, deleted
    notification_settings JSONB DEFAULT '{
        "push": true,
        "email": true,
        "sms": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_status ON profiles(status);
```

#### influencer_profiles (인플루언서 추가 정보)
```sql
CREATE TABLE public.influencer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- 인플루언서 정보
    display_name VARCHAR(100) NOT NULL,   -- 활동명
    category VARCHAR(50),                  -- 여행, 뷰티, 먹방 등
    follower_count INTEGER DEFAULT 0,      -- 팔로워 수
    description TEXT,                      -- 인플루언서 소개
    sns_links JSONB DEFAULT '[]',          -- [{platform, url}]

    -- 정산 정보
    bank_name VARCHAR(50),                 -- 은행명
    bank_account VARCHAR(50),              -- 계좌번호
    account_holder VARCHAR(100),           -- 예금주
    business_number VARCHAR(20),           -- 사업자등록번호 (선택)

    -- 수수료 설정 (개별 설정, null이면 기본값 적용)
    custom_course_fee_rate DECIMAL(5,2),   -- 코스 수수료율
    custom_party_fee_rate DECIMAL(5,2),    -- 파티 수수료율

    -- 통계
    total_courses INTEGER DEFAULT 0,
    total_parties INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,

    -- 상태
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    is_featured BOOLEAN DEFAULT FALSE,     -- 추천 인플루언서

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_influencer_user UNIQUE (user_id)
);

-- 인덱스
CREATE INDEX idx_influencer_category ON influencer_profiles(category);
CREATE INDEX idx_influencer_verification ON influencer_profiles(verification_status);
CREATE INDEX idx_influencer_featured ON influencer_profiles(is_featured);
```

### 2.2 코스 관련

#### courses (여행 코스)
```sql
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- 기본 정보
    title VARCHAR(200) NOT NULL,           -- 코스 제목
    description TEXT,                       -- 코스 설명
    thumbnail_url TEXT,                     -- 썸네일 이미지
    images JSONB DEFAULT '[]',              -- 추가 이미지 배열

    -- 여행지 정보
    country VARCHAR(100) NOT NULL,          -- 국가
    city VARCHAR(100) NOT NULL,             -- 도시

    -- 일정
    start_date DATE NOT NULL,               -- 시작일
    end_date DATE NOT NULL,                 -- 종료일
    total_days INTEGER NOT NULL,            -- 총 일수

    -- 모집 정보
    recruitment_start DATE NOT NULL,        -- 모집 시작일
    recruitment_end DATE NOT NULL,          -- 모집 마감일
    min_participants INTEGER DEFAULT 1,     -- 최소 인원
    max_participants INTEGER NOT NULL,      -- 최대 인원
    current_participants INTEGER DEFAULT 0, -- 현재 확정 인원

    -- 참가 조건
    allowed_gender VARCHAR(20) DEFAULT 'all', -- all, male, female
    min_age INTEGER,                        -- 최소 나이
    max_age INTEGER,                        -- 최대 나이
    requirements TEXT,                       -- 추가 참가 조건

    -- 비용
    price DECIMAL(12,2) NOT NULL,           -- 참가비
    price_includes TEXT,                     -- 포함 사항 설명
    price_excludes TEXT,                     -- 불포함 사항 설명

    -- 포함/선택 사항
    included_items JSONB DEFAULT '[]',      -- 포함 항목 [{name, description}]
    optional_items JSONB DEFAULT '[]',      -- 선택 항목 [{name, description, price}]

    -- 숙소 정보
    accommodation JSONB DEFAULT '{
        "name": "",
        "description": "",
        "address": "",
        "map_url": "",
        "images": []
    }',

    -- 상태
    status VARCHAR(20) DEFAULT 'draft',     -- draft, recruiting, closed, ongoing, completed, cancelled
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, unlisted

    -- 환불 정책
    refund_policy TEXT,

    -- 메타데이터
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스
CREATE INDEX idx_courses_influencer ON courses(influencer_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_dates ON courses(start_date, end_date);
CREATE INDEX idx_courses_recruitment ON courses(recruitment_start, recruitment_end);
CREATE INDEX idx_courses_location ON courses(country, city);
```

#### course_days (일자별 일정)
```sql
CREATE TABLE public.course_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    day_number INTEGER NOT NULL,            -- Day 1, 2, 3...
    date DATE NOT NULL,                     -- 실제 날짜
    title VARCHAR(200),                     -- 해당 일자 제목

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_course_day UNIQUE (course_id, day_number)
);

-- 인덱스
CREATE INDEX idx_course_days_course ON course_days(course_id);
```

#### course_day_items (일정 상세 항목)
```sql
CREATE TABLE public.course_day_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_day_id UUID NOT NULL REFERENCES course_days(id) ON DELETE CASCADE,

    order_index INTEGER NOT NULL,           -- 순서
    time_slot VARCHAR(50),                  -- 시간대 (예: "09:00", "오전")
    title VARCHAR(200) NOT NULL,            -- 항목 제목
    description TEXT,                       -- 항목 설명
    location_name VARCHAR(200),             -- 장소명
    location_address TEXT,                  -- 주소
    map_url TEXT,                           -- 구글맵 링크
    images JSONB DEFAULT '[]',              -- 이미지 배열
    item_type VARCHAR(50) DEFAULT 'activity', -- activity, meal, transport, free
    is_optional BOOLEAN DEFAULT FALSE,      -- 선택 사항 여부

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_course_day_items_day ON course_day_items(course_day_id);
CREATE INDEX idx_course_day_items_order ON course_day_items(course_day_id, order_index);
```

### 2.3 신청/참가 관련

#### course_applications (코스 신청)
```sql
CREATE TABLE public.course_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- 신청 정보
    applicant_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    instagram_url VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    introduction TEXT,                      -- 자기소개/신청 동기

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',   -- pending, confirmed, rejected, cancelled
    status_reason TEXT,                      -- 상태 변경 사유

    -- 결제 정보
    payment_id UUID,                        -- 연결된 결제
    paid_amount DECIMAL(12,2),              -- 결제 금액

    -- 타임스탬프
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_course_application UNIQUE (course_id, user_id)
);

-- 인덱스
CREATE INDEX idx_course_apps_course ON course_applications(course_id);
CREATE INDEX idx_course_apps_user ON course_applications(user_id);
CREATE INDEX idx_course_apps_status ON course_applications(status);
```

#### course_participants_expenses (참가자 경비)
```sql
CREATE TABLE public.course_participants_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- 경비 잔액
    balance DECIMAL(12,2) DEFAULT 0,        -- 현재 잔액
    total_charged DECIMAL(12,2) DEFAULT 0,  -- 총 충전액
    total_used DECIMAL(12,2) DEFAULT 0,     -- 총 사용액

    -- 요청된 충전 금액
    requested_amount DECIMAL(12,2),          -- 인플루언서가 요청한 금액

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_participant_expense UNIQUE (course_id, user_id)
);

-- 인덱스
CREATE INDEX idx_expenses_course ON course_participants_expenses(course_id);
CREATE INDEX idx_expenses_user ON course_participants_expenses(user_id);
```

#### expense_transactions (경비 거래 내역)
```sql
CREATE TABLE public.expense_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES course_participants_expenses(id),

    type VARCHAR(20) NOT NULL,              -- charge(충전), deduct(차감), refund(환불)
    amount DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,   -- 거래 후 잔액

    -- 관련 정보
    payment_id UUID,                        -- 충전 시 결제 ID
    nbang_item_id UUID,                     -- 차감 시 N빵 항목 ID
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_expense_tx_expense ON expense_transactions(expense_id);
CREATE INDEX idx_expense_tx_type ON expense_transactions(type);
```

### 2.4 N빵 정산 관련

#### course_nbang_items (N빵 정산 항목)
```sql
CREATE TABLE public.course_nbang_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),

    -- 항목 정보
    title VARCHAR(200) NOT NULL,            -- N빵 항목명
    description TEXT,
    total_amount DECIMAL(12,2) NOT NULL,    -- 총 금액
    per_person_amount DECIMAL(12,2) NOT NULL, -- 1인당 금액

    -- 수수료 옵션
    include_fee_in_amount BOOLEAN DEFAULT FALSE, -- 수수료 포함 여부

    -- 참여자 수
    participant_count INTEGER NOT NULL,

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',   -- pending, completed, cancelled

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_nbang_items_course ON course_nbang_items(course_id);
CREATE INDEX idx_nbang_items_status ON course_nbang_items(status);
```

#### course_nbang_participants (N빵 참여자)
```sql
CREATE TABLE public.course_nbang_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nbang_item_id UUID NOT NULL REFERENCES course_nbang_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),

    amount DECIMAL(12,2) NOT NULL,          -- 부담 금액
    is_paid BOOLEAN DEFAULT FALSE,          -- 경비에서 차감 완료 여부
    paid_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_nbang_participant UNIQUE (nbang_item_id, user_id)
);

-- 인덱스
CREATE INDEX idx_nbang_participants_item ON course_nbang_participants(nbang_item_id);
CREATE INDEX idx_nbang_participants_user ON course_nbang_participants(user_id);
```

### 2.5 파티 관련

#### parties (파티/이벤트)
```sql
CREATE TABLE public.parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    images JSONB DEFAULT '[]',

    -- 장소/시간
    location_name VARCHAR(200),
    location_address TEXT,
    map_url TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,

    -- 모집 정보
    recruitment_start DATE NOT NULL,
    recruitment_end DATE NOT NULL,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,

    -- 참가 조건
    allowed_gender VARCHAR(20) DEFAULT 'all',
    min_age INTEGER,
    max_age INTEGER,

    -- 비용
    price DECIMAL(12,2) NOT NULL,
    price_description TEXT,

    -- 상태
    status VARCHAR(20) DEFAULT 'draft',     -- draft, recruiting, closed, ongoing, completed, cancelled

    -- 환불 정책
    refund_policy TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_parties_influencer ON parties(influencer_id);
CREATE INDEX idx_parties_status ON parties(status);
CREATE INDEX idx_parties_date ON parties(event_date);
```

#### party_applications (파티 신청)
```sql
CREATE TABLE public.party_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID NOT NULL REFERENCES parties(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- 신청 정보
    applicant_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    instagram_url VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    introduction TEXT,

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',
    status_reason TEXT,

    -- 결제 정보
    payment_id UUID,
    paid_amount DECIMAL(12,2),

    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_party_application UNIQUE (party_id, user_id)
);

-- 인덱스
CREATE INDEX idx_party_apps_party ON party_applications(party_id);
CREATE INDEX idx_party_apps_user ON party_applications(user_id);
CREATE INDEX idx_party_apps_status ON party_applications(status);
```

### 2.6 결제/정산 관련

#### payments (결제 내역)
```sql
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- 결제 유형
    payment_type VARCHAR(50) NOT NULL,      -- course_fee, party_fee, expense_charge
    reference_type VARCHAR(50),             -- course, party
    reference_id UUID,                      -- 코스/파티 ID

    -- 결제 정보
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),             -- naverpay, card
    pg_provider VARCHAR(50),                -- 네이버페이, 토스 등

    -- PG 응답 정보
    pg_transaction_id VARCHAR(100),         -- PG사 거래번호
    pg_response JSONB,                      -- PG사 응답 원본

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',   -- pending, completed, failed, refunded, partial_refunded

    -- 환불 정보
    refunded_amount DECIMAL(12,2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,

    -- 타임스탬프
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(reference_type, reference_id);
CREATE INDEX idx_payments_pg_tx ON payments(pg_transaction_id);
```

#### settlements (정산 내역)
```sql
CREATE TABLE public.settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- 정산 대상
    settlement_type VARCHAR(50) NOT NULL,   -- course, party, nbang
    reference_type VARCHAR(50),
    reference_id UUID,

    -- 금액 정보
    gross_amount DECIMAL(12,2) NOT NULL,    -- 총 수입
    fee_rate DECIMAL(5,2) NOT NULL,         -- 수수료율
    fee_amount DECIMAL(12,2) NOT NULL,      -- 수수료
    pg_fee_amount DECIMAL(12,2) DEFAULT 0,  -- PG 수수료
    net_amount DECIMAL(12,2) NOT NULL,      -- 정산액 (실수령액)

    -- 상태
    status VARCHAR(20) DEFAULT 'pending',   -- pending, processing, completed, failed

    -- 지급 정보
    bank_name VARCHAR(50),
    bank_account VARCHAR(50),
    account_holder VARCHAR(100),

    -- 타임스탬프
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- 증빙
    receipt_url TEXT,
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_settlements_influencer ON settlements(influencer_id);
CREATE INDEX idx_settlements_type ON settlements(settlement_type);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_reference ON settlements(reference_type, reference_id);
```

### 2.7 공지/메시지 관련

#### course_announcements (코스 공지사항)
```sql
CREATE TABLE public.course_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),

    title VARCHAR(200),
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',

    is_pinned BOOLEAN DEFAULT FALSE,        -- 상단 고정

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_announcements_course ON course_announcements(course_id);
```

#### announcement_comments (공지사항 댓글)
```sql
CREATE TABLE public.announcement_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES course_announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),

    content TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_comments_announcement ON announcement_comments(announcement_id);
```

#### direct_messages (1:1 메시지)
```sql
CREATE TABLE public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id),
    receiver_id UUID NOT NULL REFERENCES profiles(id),

    -- 관련 코스/파티 (선택)
    related_type VARCHAR(50),               -- course, party
    related_id UUID,

    content TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_dm_conversation ON direct_messages(sender_id, receiver_id);
```

### 2.8 후기/평점 관련

#### reviews (후기)
```sql
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- 리뷰 대상
    review_type VARCHAR(50) NOT NULL,       -- course, party, influencer
    reference_id UUID NOT NULL,

    -- 평점
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

    -- 내용
    content TEXT,
    images JSONB DEFAULT '[]',

    -- 상태
    status VARCHAR(20) DEFAULT 'active',    -- active, hidden, deleted
    is_reported BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_review UNIQUE (user_id, review_type, reference_id)
);

-- 인덱스
CREATE INDEX idx_reviews_type_ref ON reviews(review_type, reference_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
```

#### travel_records (여행 기록)
```sql
CREATE TABLE public.travel_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    title VARCHAR(200),
    content TEXT,
    images JSONB DEFAULT '[]',

    -- 공개 설정
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, friends

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_records_course ON travel_records(course_id);
CREATE INDEX idx_records_user ON travel_records(user_id);
CREATE INDEX idx_records_visibility ON travel_records(visibility);
```

### 2.9 알림 관련

#### notifications (알림)
```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    type VARCHAR(50) NOT NULL,              -- 알림 유형
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- 관련 데이터
    data JSONB DEFAULT '{}',                -- {referenceType, referenceId, ...}

    -- 상태
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- 발송 상태
    sent_push BOOLEAN DEFAULT FALSE,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### 2.10 관리자 설정

#### admin_settings (관리자 설정)
```sql
CREATE TABLE public.admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,

    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 설정값 삽입
INSERT INTO admin_settings (key, value, description) VALUES
('default_course_fee_rate', '10', '기본 코스 수수료율 (%)'),
('default_party_fee_rate', '10', '기본 파티 수수료율 (%)'),
('pg_fee_rate', '3.3', 'PG 수수료율 (%)'),
('min_expense_charge', '50000', '최소 경비 충전 금액'),
('platform_terms_version', '"1.0"', '이용약관 버전'),
('refund_policy_version', '"1.0"', '환불정책 버전');
```

#### fee_history (수수료 변경 이력)
```sql
CREATE TABLE public.fee_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencer_profiles(id), -- NULL이면 전체 기본값

    fee_type VARCHAR(50) NOT NULL,          -- course, party, pg
    old_rate DECIMAL(5,2),
    new_rate DECIMAL(5,2) NOT NULL,

    changed_by UUID REFERENCES profiles(id),
    reason TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_fee_history_influencer ON fee_history(influencer_id);
```

### 2.11 신고/관리

#### reports (신고)
```sql
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id),

    -- 신고 대상
    target_type VARCHAR(50) NOT NULL,       -- user, review, message
    target_id UUID NOT NULL,

    -- 신고 내용
    reason VARCHAR(100) NOT NULL,           -- spam, harassment, inappropriate, etc
    description TEXT,

    -- 처리
    status VARCHAR(20) DEFAULT 'pending',   -- pending, reviewed, resolved, dismissed
    handled_by UUID REFERENCES profiles(id),
    handled_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
```

---

## 3. 뷰 (Views)

### 3.1 코스 상세 뷰
```sql
CREATE VIEW v_course_details AS
SELECT
    c.*,
    ip.display_name as influencer_name,
    ip.avatar_url as influencer_avatar,
    ip.average_rating as influencer_rating,
    p.instagram_url as influencer_instagram,
    COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'pending') as pending_count,
    COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'confirmed') as confirmed_count,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT r.id) as review_count
FROM courses c
JOIN influencer_profiles ip ON c.influencer_id = ip.id
JOIN profiles p ON ip.user_id = p.id
LEFT JOIN course_applications ca ON c.id = ca.course_id
LEFT JOIN reviews r ON r.reference_id = c.id AND r.review_type = 'course'
GROUP BY c.id, ip.id, p.id;
```

### 3.2 정산 요약 뷰
```sql
CREATE VIEW v_settlement_summary AS
SELECT
    ip.id as influencer_id,
    ip.display_name,
    ip.user_id,
    SUM(s.gross_amount) FILTER (WHERE s.status = 'completed') as total_gross,
    SUM(s.fee_amount) FILTER (WHERE s.status = 'completed') as total_fees,
    SUM(s.net_amount) FILTER (WHERE s.status = 'completed') as total_net,
    SUM(s.net_amount) FILTER (WHERE s.status = 'pending') as pending_amount
FROM influencer_profiles ip
LEFT JOIN settlements s ON ip.id = s.influencer_id
GROUP BY ip.id;
```

---

## 4. 함수 및 트리거

### 4.1 업데이트 타임스탬프 트리거
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 모든 테이블에 트리거 적용
CREATE TRIGGER tr_profiles_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- (다른 테이블들도 동일하게 적용)
```

### 4.2 참가자 수 업데이트 트리거
```sql
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'course_applications' THEN
        UPDATE courses
        SET current_participants = (
            SELECT COUNT(*) FROM course_applications
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
            AND status = 'confirmed'
        )
        WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    ELSIF TG_TABLE_NAME = 'party_applications' THEN
        UPDATE parties
        SET current_participants = (
            SELECT COUNT(*) FROM party_applications
            WHERE party_id = COALESCE(NEW.party_id, OLD.party_id)
            AND status = 'confirmed'
        )
        WHERE id = COALESCE(NEW.party_id, OLD.party_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_course_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON course_applications
    FOR EACH ROW EXECUTE FUNCTION update_participant_count();

CREATE TRIGGER tr_party_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON party_applications
    FOR EACH ROW EXECUTE FUNCTION update_participant_count();
```

### 4.3 인플루언서 통계 업데이트
```sql
CREATE OR REPLACE FUNCTION update_influencer_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE influencer_profiles ip
    SET
        total_courses = (SELECT COUNT(*) FROM courses WHERE influencer_id = ip.id AND status != 'draft'),
        total_parties = (SELECT COUNT(*) FROM parties WHERE influencer_id = ip.id AND status != 'draft'),
        total_participants = (
            SELECT COALESCE(SUM(current_participants), 0)
            FROM (
                SELECT current_participants FROM courses WHERE influencer_id = ip.id AND status = 'completed'
                UNION ALL
                SELECT current_participants FROM parties WHERE influencer_id = ip.id AND status = 'completed'
            ) sub
        ),
        average_rating = (
            SELECT AVG(rating)
            FROM reviews r
            WHERE r.review_type = 'influencer' AND r.reference_id = ip.user_id
        )
    WHERE ip.id = NEW.influencer_id OR ip.user_id = NEW.reference_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. 인덱스 최적화

### 5.1 복합 인덱스
```sql
-- 코스 검색 최적화
CREATE INDEX idx_courses_search ON courses(status, country, city, start_date);

-- 신청 상태 조회 최적화
CREATE INDEX idx_apps_user_status ON course_applications(user_id, status);

-- 알림 조회 최적화
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC)
WHERE is_read = FALSE;
```

### 5.2 부분 인덱스
```sql
-- 활성 코스만 인덱싱
CREATE INDEX idx_active_courses ON courses(start_date, end_date)
WHERE status IN ('recruiting', 'ongoing');

-- 미처리 정산만 인덱싱
CREATE INDEX idx_pending_settlements ON settlements(created_at)
WHERE status = 'pending';
```

---

## 6. 마이그레이션 전략

### 6.1 마이그레이션 파일 구조
```
supabase/migrations/
├── 20250118000001_create_profiles.sql
├── 20250118000002_create_influencers.sql
├── 20250118000003_create_courses.sql
├── 20250118000004_create_applications.sql
├── 20250118000005_create_payments.sql
├── 20250118000006_create_messages.sql
├── 20250118000007_create_reviews.sql
├── 20250118000008_create_admin.sql
├── 20250118000009_create_functions.sql
├── 20250118000010_create_triggers.sql
├── 20250118000011_create_rls.sql
└── 20250118000012_seed_data.sql
```

### 6.2 시드 데이터
```sql
-- 기본 관리자 계정
INSERT INTO profiles (id, email, name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@platform.com', '관리자', 'super_admin');

-- 기본 설정값
INSERT INTO admin_settings (key, value, description) VALUES
('platform_name', '"인플루언서 여행"', '플랫폼명'),
('contact_email', '"support@platform.com"', '고객센터 이메일'),
('contact_phone', '"02-1234-5678"', '고객센터 전화번호');
```

---

## 7. 백업 및 복구

### 7.1 Supabase 백업 정책
- **자동 백업**: 일 1회 (Point-in-Time Recovery)
- **보관 기간**: 7일 (Pro 플랜), 30일 (Team 플랜)

### 7.2 수동 백업 스크립트
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# S3 업로드 (선택)
# aws s3 cp ${BACKUP_FILE}.gz s3://backup-bucket/
```

---

## 8. 성능 모니터링 쿼리

### 8.1 느린 쿼리 확인
```sql
SELECT
    query,
    calls,
    mean_time,
    total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 8.2 테이블 크기 확인
```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
```
