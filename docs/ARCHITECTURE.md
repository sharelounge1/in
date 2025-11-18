# 기술 아키텍처 문서

**프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
**문서 버전**: 1.0
**작성일**: 2025-01-18

---

## 1. 시스템 아키텍처 개요

### 1.1 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        클라이언트 레이어                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   모바일 웹뷰    │   데스크톱 웹    │      관리자 대시보드          │
│   (유저용)       │  (인플루언서용)  │        (어드민용)            │
│   React/PWA     │    React/Vite   │      React/Vite             │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                        │
         └─────────────────┼────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   CDN/Edge   │
                    │  (Cloudflare)│
                    └──────┬──────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      서버 레이어 (Render.com)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   API 서버    │  │  Worker 서버  │  │    WebSocket 서버     │   │
│  │  (Node.js/   │  │  (Background │  │   (실시간 알림/채팅)    │   │
│  │   Express)   │  │    Jobs)     │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         └─────────────────┼──────────────────────┘               │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                     데이터 레이어 (Supabase)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  PostgreSQL │  │   Storage   │  │  Realtime   │  │   Auth   │ │
│  │   (메인DB)   │  │  (파일저장)  │  │  (실시간)   │  │  (인증)   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                       외부 서비스 연동                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   네이버    │  │    카카오    │  │   문자/알림  │  │  이메일   │ │
│  │  페이 PG    │  │   소셜로그인  │  │   (NHN등)   │  │ (SendGrid)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 1.2 기술 스택 상세

| 레이어 | 기술 | 버전 | 용도 |
|--------|------|------|------|
| **Frontend** | React | 18.x | UI 프레임워크 |
| | TypeScript | 5.x | 타입 안정성 |
| | Vite | 5.x | 빌드 도구 |
| | TailwindCSS | 3.x | 스타일링 |
| | Zustand | 4.x | 상태 관리 |
| | React Query | 5.x | 서버 상태 관리 |
| | React Router | 6.x | 라우팅 |
| **Backend** | Node.js | 20.x LTS | 런타임 |
| | Express.js | 4.x | API 서버 |
| | TypeScript | 5.x | 타입 안정성 |
| | Bull | 4.x | 작업 큐 |
| | Socket.io | 4.x | 실시간 통신 |
| **Database** | PostgreSQL | 15.x | 메인 데이터베이스 |
| | Supabase | - | BaaS 플랫폼 |
| | Redis | 7.x | 캐싱/세션 |
| **Infra** | Render.com | - | 호스팅/배포 |
| | Cloudflare | - | CDN/보안 |
| **External** | 네이버페이 | - | PG 결제 |
| | Kakao OAuth | - | 소셜 로그인 |
| | NHN Cloud | - | SMS 발송 |
| | SendGrid | - | 이메일 발송 |

---

## 2. Render.com 서비스 구성

### 2.1 서비스 목록

```yaml
# render.yaml
services:
  # 메인 API 서버
  - type: web
    name: travel-api
    env: node
    plan: starter # $7/month
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: travel-db
          property: connectionString
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_KEY
        sync: false

  # 백그라운드 워커
  - type: worker
    name: travel-worker
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run worker
    envVars:
      - key: NODE_ENV
        value: production

  # WebSocket 서버 (실시간 알림)
  - type: web
    name: travel-realtime
    env: node
    plan: starter
    buildCommand: npm install && npm run build:ws
    startCommand: npm run start:ws

databases:
  - name: travel-redis
    type: redis
    plan: free
```

### 2.2 환경별 구성

| 환경 | API URL | 용도 |
|------|---------|------|
| Development | `http://localhost:3000` | 로컬 개발 |
| Staging | `https://travel-api-staging.onrender.com` | 테스트 |
| Production | `https://travel-api.onrender.com` | 프로덕션 |

---

## 3. Supabase 구성

### 3.1 프로젝트 설정

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### 3.2 Supabase 기능 활용

| 기능 | 용도 | 설정 |
|------|------|------|
| **Auth** | 사용자 인증 | 카카오 OAuth, 이메일 인증 |
| **Database** | 데이터 저장 | RLS 정책 적용 |
| **Storage** | 파일 저장 | 프로필 이미지, 여행 사진 |
| **Realtime** | 실시간 업데이트 | 알림, 채팅, 공지사항 |
| **Edge Functions** | 서버리스 함수 | 결제 웹훅, 스케줄 작업 |

### 3.3 Storage 버킷 구조

```
storage/
├── avatars/           # 프로필 이미지
│   └── {user_id}/
├── courses/           # 코스 이미지
│   └── {course_id}/
├── parties/           # 파티 이미지
│   └── {party_id}/
├── travel-records/    # 여행 기록 사진
│   └── {record_id}/
└── documents/         # 정산 증빙 서류
    └── {settlement_id}/
```

### 3.4 Row Level Security (RLS) 정책

```sql
-- 사용자는 자신의 데이터만 조회/수정 가능
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 인플루언서는 자신의 코스만 관리 가능
CREATE POLICY "Influencers can manage own courses"
ON courses FOR ALL
USING (auth.uid() = influencer_id);

-- 참가 확정된 유저만 공지사항 조회 가능
CREATE POLICY "Participants can view announcements"
ON course_announcements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_applications
    WHERE course_id = course_announcements.course_id
    AND user_id = auth.uid()
    AND status = 'confirmed'
  )
);
```

---

## 4. API 서버 구조

### 4.1 디렉토리 구조

```
server/
├── src/
│   ├── config/            # 설정
│   │   ├── database.ts
│   │   ├── supabase.ts
│   │   └── payment.ts
│   ├── controllers/       # 컨트롤러
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── parties/
│   │   ├── payments/
│   │   └── admin/
│   ├── middlewares/       # 미들웨어
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── validation.ts
│   ├── models/            # 모델
│   │   └── index.ts
│   ├── routes/            # 라우트
│   │   ├── v1/
│   │   └── index.ts
│   ├── services/          # 비즈니스 로직
│   │   ├── payment/
│   │   ├── notification/
│   │   └── settlement/
│   ├── jobs/              # 백그라운드 작업
│   │   ├── refund.ts
│   │   ├── settlement.ts
│   │   └── notification.ts
│   ├── utils/             # 유틸리티
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── types/             # 타입 정의
│       └── index.ts
├── tests/
└── package.json
```

### 4.2 API 버전 관리

```typescript
// src/routes/index.ts
import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

router.use('/api/v1', v1Routes);

export default router;
```

---

## 5. 결제 시스템 아키텍처

### 5.1 결제 플로우

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  유저   │────▶│   FE    │────▶│   BE    │────▶│ 네이버  │
│         │     │         │     │         │     │  페이   │
└─────────┘     └─────────┘     └────┬────┘     └────┬────┘
                                     │               │
                                     │◀──────────────┘
                                     │    (웹훅)
                              ┌──────▼──────┐
                              │   결제 완료  │
                              │   처리 로직  │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐
                              │   Supabase  │
                              │  (DB 저장)  │
                              └─────────────┘
```

### 5.2 결제 유형별 처리

| 결제 유형 | 처리 방식 | 비고 |
|-----------|-----------|------|
| 코스 참가비 | 일반 결제 | 선정 시 확정, 미선정 시 자동 환불 |
| 파티 참가비 | 일반 결제 | 선정 시 확정, 미선정 시 자동 환불 |
| 경비 충전 | 선불 결제 | 여행 전용 포인트로 전환 |
| N빵 정산 | 포인트 차감 | 충전된 경비에서 자동 차감 |

### 5.3 환불 정책 구현

```typescript
// 환불 처리 로직
interface RefundPolicy {
  courseRefund: {
    beforeSelection: 'FULL',      // 선정 전: 전액 환불
    afterSelection: 'NONE',       // 선정 후: 환불 불가
    notSelected: 'AUTO_FULL'      // 미선정: 자동 전액 환불
  },
  partyRefund: {
    beforeSelection: 'FULL',
    afterSelection: 'NONE',
    notSelected: 'AUTO_FULL'
  },
  expenseRefund: {
    unused: 'FULL',               // 미사용 경비: 전액 환불
    partial: 'REMAINING'          // 여행 종료 후 잔액 환불
  }
}
```

---

## 6. 실시간 기능 아키텍처

### 6.1 Supabase Realtime 채널 구조

```typescript
// 실시간 구독 채널
const channels = {
  // 코스별 공지사항
  courseAnnouncements: `course:${courseId}:announcements`,

  // 1:1 메시지
  directMessages: `dm:${senderId}:${receiverId}`,

  // 알림
  userNotifications: `user:${userId}:notifications`,

  // N빵 정산 알림
  expenseUpdates: `course:${courseId}:expenses`
}
```

### 6.2 알림 시스템

```typescript
// 알림 유형
enum NotificationType {
  // 신청 관련
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_CONFIRMED = 'application_confirmed',
  APPLICATION_REJECTED = 'application_rejected',

  // 결제 관련
  PAYMENT_COMPLETED = 'payment_completed',
  REFUND_COMPLETED = 'refund_completed',
  EXPENSE_CHARGE_REQUEST = 'expense_charge_request',

  // 여행 관련
  NEW_ANNOUNCEMENT = 'new_announcement',
  EXPENSE_DEDUCTED = 'expense_deducted',
  TRAVEL_REMINDER = 'travel_reminder',

  // 정산 관련
  SETTLEMENT_COMPLETED = 'settlement_completed',

  // 메시지
  NEW_MESSAGE = 'new_message'
}
```

---

## 7. 보안 아키텍처

### 7.1 인증/인가 구조

```
┌─────────────────────────────────────────┐
│              인증 플로우                  │
├─────────────────────────────────────────┤
│                                         │
│  1. 카카오 OAuth ─▶ Supabase Auth       │
│                                         │
│  2. JWT 토큰 발급                        │
│     ├─ Access Token (15분)              │
│     └─ Refresh Token (7일)              │
│                                         │
│  3. 휴대폰 본인인증 (필수)                │
│     └─ KG이니시스/PASS 연동              │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 역할 기반 접근 제어 (RBAC)

```typescript
// 역할 정의
enum UserRole {
  USER = 'user',
  INFLUENCER = 'influencer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// 권한 매트릭스
const permissions = {
  user: [
    'course:view', 'course:apply',
    'party:view', 'party:apply',
    'profile:manage', 'review:write'
  ],
  influencer: [
    ...permissions.user,
    'course:create', 'course:manage',
    'party:create', 'party:manage',
    'participants:manage', 'announcement:create'
  ],
  admin: [
    ...permissions.influencer,
    'users:view', 'settlements:manage',
    'fees:manage', 'reports:view'
  ],
  super_admin: [
    '*' // 모든 권한
  ]
}
```

### 7.3 보안 설정

```typescript
// 보안 미들웨어 구성
const securityConfig = {
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 요청 수
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
  },

  // CORS
  cors: {
    origin: [
      'https://travel-app.com',
      'https://admin.travel-app.com'
    ],
    credentials: true
  },

  // Helmet (보안 헤더)
  helmet: {
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true
  }
}
```

---

## 8. 배포 파이프라인

### 8.1 CI/CD 구조

```yaml
# GitHub Actions
name: Deploy to Render

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Type check
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### 8.2 환경 변수 관리

| 변수명 | 환경 | 설명 |
|--------|------|------|
| `SUPABASE_URL` | 공통 | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | 공통 | Supabase 익명 키 |
| `SUPABASE_SERVICE_KEY` | 서버 | Supabase 서비스 키 |
| `NAVER_PAY_CLIENT_ID` | 서버 | 네이버페이 클라이언트 ID |
| `NAVER_PAY_CLIENT_SECRET` | 서버 | 네이버페이 시크릿 |
| `REDIS_URL` | 서버 | Redis 연결 URL |
| `JWT_SECRET` | 서버 | JWT 서명 키 |

---

## 9. 모니터링 및 로깅

### 9.1 모니터링 스택

```
┌─────────────────┐     ┌─────────────────┐
│  Application    │────▶│   Render        │
│   Metrics       │     │   Dashboard     │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   Error         │────▶│    Sentry       │
│   Tracking      │     │                 │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   Logs          │────▶│   Render        │
│                 │     │   Log Streams   │
└─────────────────┘     └─────────────────┘
```

### 9.2 로깅 구조

```typescript
// winston 로거 설정
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 로그 레벨
// - error: 시스템 오류
// - warn: 경고 (환불 실패 등)
// - info: 중요 이벤트 (결제 완료 등)
// - debug: 디버깅 정보
```

---

## 10. 확장성 고려사항

### 10.1 수평 확장 전략

```
┌─────────────────────────────────────────┐
│           로드 밸런서                     │
│         (Render Auto-scaling)           │
└────────┬─────────┬─────────┬────────────┘
         │         │         │
    ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐
    │ API-1  │ │ API-2  │ │ API-N  │
    └────────┘ └────────┘ └────────┘
```

### 10.2 데이터베이스 최적화

- **인덱싱**: 자주 조회되는 컬럼에 인덱스 설정
- **파티셔닝**: 대용량 테이블 (결제 내역 등) 파티셔닝
- **Read Replica**: 읽기 부하 분산 (Supabase Pro 이상)

### 10.3 캐싱 전략

```typescript
// Redis 캐싱
const cacheStrategy = {
  // 자주 조회되는 데이터
  courseDetails: { ttl: 300 },      // 5분
  userProfile: { ttl: 600 },        // 10분
  feeSettings: { ttl: 3600 },       // 1시간

  // 세션/토큰
  refreshToken: { ttl: 604800 },    // 7일

  // 실시간성 필요
  applicationStatus: { ttl: 60 }    // 1분
}
```

---

## 11. 재해 복구 계획

### 11.1 백업 정책

| 대상 | 주기 | 보관 기간 | 방법 |
|------|------|-----------|------|
| PostgreSQL | 일 1회 | 30일 | Supabase 자동 백업 |
| Storage | 실시간 | 무제한 | Supabase 복제 |
| Redis | 일 1회 | 7일 | RDB 스냅샷 |

### 11.2 복구 목표

- **RTO** (Recovery Time Objective): 4시간
- **RPO** (Recovery Point Objective): 1시간

---

## 12. 비용 추정

### 12.1 월간 예상 비용 (초기)

| 서비스 | 플랜 | 월 비용 |
|--------|------|---------|
| Render API 서버 | Starter | $7 |
| Render Worker | Starter | $7 |
| Render WebSocket | Starter | $7 |
| Supabase | Pro | $25 |
| Cloudflare | Free | $0 |
| SendGrid | Free | $0 |
| **총합** | | **$46/월** |

### 12.2 스케일업 시 비용 (월 MAU 1만 기준)

| 서비스 | 플랜 | 월 비용 |
|--------|------|---------|
| Render API 서버 | Standard | $25 |
| Render Worker | Standard | $25 |
| Render WebSocket | Standard | $25 |
| Supabase | Pro | $25 |
| Cloudflare | Pro | $20 |
| SendGrid | Essentials | $20 |
| **총합** | | **$140/월** |
