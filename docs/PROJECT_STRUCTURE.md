# 프로젝트 구조 (Project Structure)

**프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
**최종 업데이트**: 2025-01-18

---

> **관련 문서**
> - [DB 현황](./DB_STATUS.md)
> - [DB 스키마 상세](./DATABASE_SCHEMA.md)
> - [API 명세서](./API_SPECIFICATION.md)
> - [백엔드 설정 가이드](./BACKEND_SETUP_GUIDE.md)
> - [화면 명세서](./SCREEN_SPECIFICATIONS.md)
> - [정보 구조도](./INFORMATION_ARCHITECTURE.md)
> - [아키텍처](./ARCHITECTURE.md)

---

## 1. 기술 스택

### Frontend
- **언어**: HTML5, CSS3, JavaScript
- **스타일**: TailwindCSS + 커스텀 Aurora Gradient 테마
- **개발 도구**: Vite
- **포트**: 5173 (개발), 5100 (프리뷰)

### Backend
- **런타임**: Node.js 20
- **프레임워크**: Express.js + TypeScript
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: JWT + Supabase Auth
- **포트**: 3000

---

## 2. 전체 디렉토리 구조

```
in/
├── CLAUDE.md                    # 개발 규칙 및 컨벤션
├── README.md                    # 프로젝트 소개
├── package.json                 # 루트 패키지 설정
├── prj_plan.txt                 # 프로젝트 기획서
│
├── docs/                        # 문서
│   ├── PROJECT_STRUCTURE.md     # 프로젝트 구조 (현재 문서)
│   ├── DB_STATUS.md             # DB 현황
│   ├── DATABASE_SCHEMA.md       # DB 스키마 상세
│   ├── API_SPECIFICATION.md     # API 명세서
│   ├── BACKEND_SETUP_GUIDE.md   # 백엔드 설정 가이드
│   ├── SCREEN_SPECIFICATIONS.md # 화면 명세서
│   ├── INFORMATION_ARCHITECTURE.md # 정보 구조도
│   ├── ARCHITECTURE.md          # 아키텍처
│   ├── SIMULATION_VERIFICATION.md # 시뮬레이션 검증
│   └── screenshots/             # 스크린샷
│
├── frontend/                    # 프론트엔드 (50개 화면)
│   ├── index.html               # 메인 진입점
│   ├── package.json             # 프론트엔드 패키지
│   ├── vite.config.js           # Vite 설정
│   ├── shared/                  # 공유 리소스
│   ├── user/                    # 유저 화면 (23개)
│   ├── influencer/              # 인플루언서 화면 (19개)
│   └── admin/                   # 관리자 화면 (8개)
│
├── server/                      # 백엔드 (53개 API)
│   ├── package.json             # 백엔드 패키지
│   ├── tsconfig.json            # TypeScript 설정
│   ├── .env                     # 환경 변수
│   ├── src/                     # 소스 코드
│   └── supabase/                # Supabase 마이그레이션
│
├── design-concepts/             # 디자인 컨셉
└── scripts/                     # 스크립트
```

---

## 3. 프론트엔드 구조 (50개 화면)

### 3.1 유저 화면 (23개)

| 파일명 | 화면명 | 설명 |
|--------|--------|------|
| `home.html` | 홈 | 메인 홈 화면, 추천 코스/파티 |
| `login.html` | 로그인 | 소셜 로그인 (카카오/네이버/애플) |
| `terms-agreement.html` | 약관 동의 | 이용약관, 개인정보처리방침 동의 |
| `course-landing.html` | 코스 랜딩 | 코스 상세 정보 |
| `course-apply.html` | 코스 신청 | 코스 참가 신청 폼 |
| `parties.html` | 파티 목록 | 파티/이벤트 목록 |
| `party-detail.html` | 파티 상세 | 파티 상세 정보 |
| `party-apply.html` | 파티 신청 | 파티 참가 신청 폼 |
| `payment-complete.html` | 결제 완료 | 결제 완료 확인 |
| `mypage.html` | 마이페이지 | 내 정보 관리 |
| `my-applications.html` | 내 신청 목록 | 신청한 코스/파티 목록 |
| `active-travels.html` | 진행 중 여행 | 현재 진행 중인 여행 |
| `travel-detail.html` | 여행 상세 | 진행 중 여행 상세 |
| `travel-schedule.html` | 여행 일정 | 일자별 일정 확인 |
| `travel-announcements.html` | 여행 공지 | 코스 공지사항 목록 |
| `announcement-detail.html` | 공지 상세 | 공지사항 상세 |
| `travel-participants.html` | 참가자 목록 | 함께하는 참가자 목록 |
| `travel-expenses.html` | 내 경비 | 경비 충전/사용 내역 |
| `travel-chat.html` | 채팅 | 참가자 간 채팅 |
| `notifications.html` | 알림 | 알림 목록 |
| `inquiry.html` | 문의하기 | 1:1 문의 작성 |
| `inquiry-list.html` | 문의 목록 | 내 문의 목록 |
| `inquiry-detail.html` | 문의 상세 | 문의 및 답변 확인 |

### 3.2 인플루언서 화면 (19개)

| 파일명 | 화면명 | 설명 |
|--------|--------|------|
| `landing.html` | 랜딩 | 인플루언서 앱 소개 |
| `dashboard.html` | 대시보드 | 통계, 빠른 액션 |
| `course-list.html` | 코스 목록 | 내 코스 관리 |
| `course-create.html` | 코스 생성 | 새 코스 만들기 |
| `course-detail.html` | 코스 상세 | 코스 상세 정보 |
| `course-edit.html` | 코스 수정 | 코스 정보 수정 |
| `applications.html` | 신청자 목록 | 코스 신청자 관리 |
| `applicant-detail.html` | 신청자 상세 | 신청자 프로필 및 선정 |
| `participants.html` | 참가자 관리 | 확정 참가자 관리 |
| `announcements-manage.html` | 공지 관리 | 공지사항 작성/관리 |
| `expense-status.html` | 경비 현황 | 참가자 경비 현황 |
| `nbang-manage.html` | N빵 정산 | N빵 항목 등록/관리 |
| `settlements.html` | 정산 내역 | 인플루언서 정산 확인 |
| `settings.html` | 설정 | 설정 메뉴 |
| `profile-settings.html` | 프로필 설정 | 인플루언서 프로필 |
| `account-settings.html` | 계좌 설정 | 정산 계좌 관리 |
| `notification-settings.html` | 알림 설정 | 알림 환경 설정 |
| `inquiries.html` | 문의 목록 | 받은 문의 목록 |
| `inquiry-detail.html` | 문의 상세 | 문의 답변 작성 |

### 3.3 관리자 화면 (8개)

| 파일명 | 화면명 | 설명 |
|--------|--------|------|
| `login.html` | 로그인 | 관리자 로그인 |
| `dashboard.html` | 대시보드 | 전체 통계, 현황 |
| `users.html` | 사용자 관리 | 전체 사용자 목록 |
| `influencers.html` | 인플루언서 관리 | 인플루언서 승인/관리 |
| `payments.html` | 결제 관리 | 전체 결제 내역 |
| `settlements.html` | 정산 관리 | 정산 승인/처리 |
| `inquiries.html` | 문의 관리 | 전체 문의 목록 |
| `inquiry-detail.html` | 문의 상세 | 문의 상세 및 답변 |

### 3.4 공유 리소스

| 파일명 | 설명 |
|--------|------|
| `shared/aurora-style.css` | Aurora Gradient 테마 스타일 |

---

## 4. 백엔드 구조 (53개 API)

### 4.1 디렉토리 구조

```
server/
├── package.json                 # 패키지 설정
├── tsconfig.json                # TypeScript 설정
├── .env                         # 환경 변수
│
├── src/
│   ├── index.ts                 # 서버 진입점
│   ├── config/
│   │   ├── env.ts               # 환경 변수 설정
│   │   └── supabase.ts          # Supabase 클라이언트
│   ├── routes/
│   │   ├── index.ts             # 라우트 통합
│   │   ├── auth.routes.ts       # 인증 API (4개)
│   │   ├── users.routes.ts      # 사용자 API (7개)
│   │   ├── courses.routes.ts    # 코스 API (7개)
│   │   ├── parties.routes.ts    # 파티 API (3개)
│   │   ├── my.routes.ts         # 내 정보 API (5개)
│   │   ├── influencer.routes.ts # 인플루언서 API (10개)
│   │   ├── payments.routes.ts   # 결제 API (2개)
│   │   ├── admin.routes.ts      # 관리자 API (10개)
│   │   ├── inquiries.routes.ts  # 문의 API (4개)
│   │   └── announcements.routes.ts # 공지 API (1개)
│   ├── middlewares/
│   │   ├── auth.ts              # 인증 미들웨어
│   │   ├── auth.middleware.ts   # 인증 미들웨어 (상세)
│   │   └── errorHandler.ts      # 에러 핸들러
│   ├── controllers/             # 컨트롤러 (향후 확장)
│   ├── services/                # 비즈니스 로직 (향후 확장)
│   ├── models/                  # 모델 (향후 확장)
│   ├── jobs/                    # 백그라운드 작업
│   ├── types/
│   │   ├── index.ts             # 타입 통합
│   │   └── api.types.ts         # API 타입 정의
│   └── utils/
│       └── response.ts          # 응답 유틸리티
│
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql  # 테이블, 함수, 트리거
        ├── 002_rls_policies.sql    # RLS 정책
        └── 003_storage_setup.sql   # Storage 버킷 정책
```

### 4.2 API 엔드포인트 요약 (53개)

| 카테고리 | 개수 | 주요 기능 |
|----------|------|-----------|
| 인증 | 4개 | 카카오 로그인, 토큰 갱신, 본인인증, 로그아웃 |
| 사용자 | 7개 | 프로필 관리, 닉네임 확인, 알림 설정 |
| 코스 | 7개 | 코스 목록/상세, 신청, 경비 |
| 파티 | 3개 | 파티 목록/상세, 신청 |
| 내 정보 | 5개 | 신청 목록, 결제 내역, 후기 |
| 인플루언서 | 10개 | 코스 생성/관리, 신청자 선정, N빵, 정산 |
| 결제 | 2개 | 결제 완료, 상세 조회 |
| 관리자 | 10개 | 인플루언서 승인, 환불, 정산, 수수료 |
| 문의 | 4개 | 문의 등록/조회, 답변 |
| 공지 | 1개 | 댓글 작성 |

> **상세 API 명세**: [API_SPECIFICATION.md](./API_SPECIFICATION.md) 참조

---

## 5. 데이터베이스 구조

### 5.1 요약
- **테이블**: 27개
- **Storage 버킷**: 5개
- **뷰**: 3개
- **RLS 정책**: 전체 테이블 적용

### 5.2 테이블 카테고리

| 카테고리 | 테이블 수 | 주요 테이블 |
|----------|-----------|-------------|
| 사용자 | 2개 | profiles, influencer_profiles |
| 코스 | 10개 | courses, course_days, course_applications... |
| 파티 | 2개 | parties, party_applications |
| 결제/정산 | 2개 | payments, settlements |
| 커뮤니케이션 | 4개 | direct_messages, notifications, inquiries... |
| 후기/기록 | 2개 | reviews, travel_records |
| 관리자 | 3개 | admin_settings, fee_history, reports |
| 기타 | 4개 | banners, notices, faqs, user_favorites |

> **상세 DB 정보**: [DB_STATUS.md](./DB_STATUS.md) 참조

---

## 6. 환경 설정

### 6.1 프론트엔드 환경 변수

```bash
# frontend/.env (필요 시 생성)
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://zzzbutkqawmthuubilfx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6.2 백엔드 환경 변수

```bash
# server/.env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://zzzbutkqawmthuubilfx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters
```

> **상세 설정 가이드**: [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md) 참조

---

## 7. 개발 명령어

### 7.1 프론트엔드

```bash
cd frontend
npm install          # 의존성 설치
npm run dev          # 개발 서버 (포트 5173)
npm run build        # 빌드
npm run preview      # 빌드 미리보기 (포트 5100)
```

### 7.2 백엔드

```bash
cd server
npm install          # 의존성 설치
npm run dev          # 개발 서버 (포트 3000)
npm run build        # TypeScript 빌드
npm start            # 프로덕션 서버
```

### 7.3 데이터베이스

Supabase Dashboard > SQL Editor에서 순서대로 실행:
1. `server/supabase/migrations/001_initial_schema.sql`
2. `server/supabase/migrations/002_rls_policies.sql`
3. Storage 버킷은 Dashboard에서 수동 생성 후 정책 적용

---

## 8. 문서 가이드

### 8.1 문서별 용도

| 문서 | 용도 | 대상 |
|------|------|------|
| PROJECT_STRUCTURE.md | 전체 프로젝트 구조 파악 | 모든 개발자 |
| DB_STATUS.md | DB 테이블/버킷/정책 현황 | 백엔드 개발자 |
| DATABASE_SCHEMA.md | DB 스키마 상세 정의 | 백엔드 개발자 |
| API_SPECIFICATION.md | API 엔드포인트 상세 | 프론트엔드/백엔드 |
| BACKEND_SETUP_GUIDE.md | 백엔드 설정 방법 | 백엔드 개발자 |
| SCREEN_SPECIFICATIONS.md | 화면별 기능 상세 | 프론트엔드 개발자 |
| INFORMATION_ARCHITECTURE.md | 화면/기능 구조도 | 기획자/개발자 |
| ARCHITECTURE.md | 시스템 아키텍처 | 전체 팀 |
| SIMULATION_VERIFICATION.md | 기능 검증 시나리오 | QA/테스터 |
| CLAUDE.md | 개발 컨벤션 및 규칙 | 모든 개발자 |

### 8.2 개발 시작 순서

1. **CLAUDE.md** - 개발 규칙 숙지
2. **PROJECT_STRUCTURE.md** - 전체 구조 파악
3. **ARCHITECTURE.md** - 시스템 아키텍처 이해
4. **DB_STATUS.md** - 데이터베이스 현황 확인
5. 역할별 상세 문서 참조

---

## 9. 배포 정보

### 9.1 개발 환경
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Database: Supabase Cloud

### 9.2 프로덕션 환경 (예정)
- Frontend: Vercel / Netlify
- Backend: Render.com
- Database: Supabase Cloud

---

## 10. 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-18 | 초기 문서 작성, 50개 화면, 53개 API |

