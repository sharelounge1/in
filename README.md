# 인플루언서 맞춤형 공동 여행 플랫폼

인플루언서가 팬들과 함께하는 여행/파티를 기획·모집·결제·정산할 수 있는 올인원 중개 플랫폼입니다.

## 프로젝트 개요

- **목적**: 인플루언서의 여행 기획 및 팬과의 소통에 집중할 수 있도록 결제/환불/정산/세무 업무를 대행
- **사용자**: 일반 유저(팬), 인플루언서, 관리자
- **환경**: 모바일 웹뷰(유저), 반응형 웹(인플루언서), 데스크톱 웹(관리자)

## 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-4-000000)
![React Query](https://img.shields.io/badge/React_Query-5-FF4154?logo=reactquery)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

### Database & Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)

### External Services
![NaverPay](https://img.shields.io/badge/NaverPay-PG-03C75A?logo=naver)
![Kakao](https://img.shields.io/badge/Kakao-OAuth-FFCD00?logo=kakao)

## 주요 기능

### 일반 유저
- **회원가입/인증**: 카카오 OAuth, 본인인증
- **코스 신청**: 인플루언서 여행 코스 신청 및 결제
- **파티 신청**: 단기 이벤트 신청 및 결제
- **여행 관리**: 공지 확인, 경비 충전, N빵 정산
- **후기 작성**: 여행 후기 및 기록 작성

### 인플루언서
- **코스 생성**: 여행 코스 등록 (일정, 숙소, 포함사항)
- **파티 개설**: 단기 이벤트 생성
- **신청자 관리**: 신청자 조회, 선정/미선정 처리
- **여행 운영**: 공지사항, 경비 충전 요청, N빵 정산
- **정산 관리**: 수익 확인, 정산 내역 조회

### 관리자
- **인플루언서 심사**: 등록 신청 승인/반려
- **수수료 관리**: 기본/개별 수수료율 설정
- **결제 관리**: 결제 내역 조회, 환불 처리
- **정산 관리**: 정산 승인, 지급 처리
- **콘텐츠 관리**: 공지사항, FAQ, 신고 처리

## 프로젝트 구조

```
├── docs/                              # 프로젝트 문서
│   ├── ARCHITECTURE.md               # 기술 아키텍처
│   ├── DATABASE_SCHEMA.md            # DB 스키마
│   ├── INFORMATION_ARCHITECTURE.md   # 정보구조도
│   ├── SCREEN_SPECIFICATIONS.md      # 화면명세서
│   ├── API_SPECIFICATION.md          # API 명세서
│   └── SIMULATION_VERIFICATION.md    # 시뮬레이션 검증
├── client/                            # Frontend 앱
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── server/                            # Backend 서버
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
├── supabase/                          # Supabase 설정
│   └── migrations/
├── CLAUDE.md                          # 개발 규칙
└── README.md
```

## 개발 가이드

### 시작하기

```bash
# 저장소 클론
git clone <repository-url>
cd influencer-travel-platform

# Frontend 설정
cd client
npm install
cp .env.example .env  # 환경변수 설정
npm run dev

# Backend 설정
cd server
npm install
cp .env.example .env  # 환경변수 설정
npm run dev

# Supabase 로컬 실행 (선택)
npx supabase start
```

### 환경 변수

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_IMP_CODE=your-iamport-code
```

**Backend (.env)**
```
NODE_ENV=development
PORT=3000
DATABASE_URL=your-database-url
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
```

### 주요 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 린트
npm run lint

# 타입 체크
npm run type-check

# DB 마이그레이션
npx supabase db push
```

## 문서

| 문서 | 설명 |
|------|------|
| [기술 아키텍처](./docs/ARCHITECTURE.md) | 시스템 구조, 기술 스택, 배포 구성 |
| [DB 스키마](./docs/DATABASE_SCHEMA.md) | 테이블 정의, 관계, 인덱스 |
| [정보구조도](./docs/INFORMATION_ARCHITECTURE.md) | 전체 사이트맵, 화면 구조 |
| [화면명세서](./docs/SCREEN_SPECIFICATIONS.md) | 화면별 UI/기능 상세 |
| [API 명세서](./docs/API_SPECIFICATION.md) | API 엔드포인트 상세 |
| [시뮬레이션 검증](./docs/SIMULATION_VERIFICATION.md) | 역할별 플로우 검증 |

## 비즈니스 모델

### 수익 구조
1. **코스 정산 수수료**: 참가비의 10% (기본, 인플루언서별 개별 설정 가능)
2. **파티 정산 수수료**: 참가비의 10% (기본)
3. **PG 수수료**: 결제 금액의 3.3%

### 정산 구조
- 참가비/경비는 플랫폼 명의로 수취
- 수수료 공제 후 인플루언서에게 정산
- 세금계산서 발행 지원

## 배포

### Render.com 배포
```yaml
# render.yaml
services:
  - type: web
    name: travel-api
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
```

### 환경
- **Development**: 로컬 개발
- **Staging**: 테스트 환경
- **Production**: 프로덕션 환경

## 화면 수

| 앱 | 화면 수 |
|-----|----------|
| 유저 앱 | 약 45개 |
| 인플루언서 앱 | 약 40개 |
| 관리자 대시보드 | 약 50개 |
| **총계** | **약 135개** |

## 라이선스

Private - All Rights Reserved

## 문의

프로젝트 관련 문의는 이슈를 통해 등록해주세요.
