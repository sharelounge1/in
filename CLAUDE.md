# CLAUDE.md - 인플루언서 여행 플랫폼 개발 규칙

## 프로젝트 개요
- **프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
- **목적**: 인플루언서가 팬들과 함께하는 여행/파티를 기획·모집·정산할 수 있는 올인원 플랫폼
- **기술스택**: React, TypeScript, Node.js, Express, Supabase, Render.com
- **포트**: Frontend 5173, Backend 3000

## 핵심 개발 철학

### 1. 안전한 결제/정산 우선 원칙
- **데이터 무결성**: 결제/환불/정산 데이터는 트랜잭션으로 처리
- **감사 추적**: 모든 금액 변동은 히스토리 기록
- **보안**: PG 연동, 개인정보 암호화 필수

### 2. FE/BE 책임 범위
```
✅ FE 담당:
- UI/UX 구현
- 클라이언트 상태 관리
- 입력 유효성 검증 (1차)
- 파일 업로드 처리

❌ BE 담당 (FE에서 구현 금지):
- 비즈니스 로직 (정산 계산, 환불 처리)
- DB 직접 조작
- 인증/인가 처리
- 결제 처리
- 민감 정보 저장
```

## 기술 스택 & 구조

### 필수 기술 스택
```
Frontend:
  Runtime: React 18 + TypeScript 5
  State: Zustand + React Query
  Style: TailwindCSS + Radix UI
  Router: React Router v6

Backend:
  Runtime: Node.js 20 + TypeScript 5
  Framework: Express.js
  DB: Supabase (PostgreSQL)
  Queue: Bull (Redis)
  Realtime: Socket.io / Supabase Realtime
```

### 프로젝트 구조
```
# Frontend
client/
├── src/
│   ├── components/
│   │   ├── ui/           # 기본 UI 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   ├── screens/      # 페이지 컴포넌트
│   │   └── layout/       # 레이아웃
│   ├── stores/           # Zustand 스토어
│   ├── hooks/            # 커스텀 훅
│   ├── services/         # API 서비스
│   ├── types/            # TypeScript 타입
│   ├── utils/            # 유틸리티
│   └── lib/              # 외부 라이브러리 설정

# Backend
server/
├── src/
│   ├── config/           # 설정
│   ├── controllers/      # 컨트롤러
│   ├── middlewares/      # 미들웨어
│   ├── models/           # 모델
│   ├── routes/           # 라우트
│   ├── services/         # 비즈니스 로직
│   ├── jobs/             # 백그라운드 작업
│   ├── utils/            # 유틸리티
│   └── types/            # 타입 정의
```

## 코딩 컨벤션

### 1. 명명 규칙
```typescript
// 컴포넌트: PascalCase
const CourseDetailScreen = () => { };

// 변수/함수: camelCase
const courseTitle = 'string';
const handleApply = () => { };

// 이벤트 핸들러: on[Action]
const onSubmit = () => { };
const onPayment = () => { };

// 상수: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_FEE_RATE = 10;

// 파일명:
// - 컴포넌트: PascalCase.tsx (CourseDetailScreen.tsx)
// - 훅: camelCase.ts (useAuth.ts)
// - 유틸: camelCase.ts (formatCurrency.ts)
```

### 2. 컴포넌트 작성 규칙
```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';

interface CourseDetailProps {
  courseId: string;
  onApply?: () => void;
}

export const CourseDetail = ({ courseId, onApply }: CourseDetailProps) => {
  // 1. State
  const [isLoading, setIsLoading] = useState(false);

  // 2. Custom hooks
  const { data: course } = useCourseDetail(courseId);

  // 3. Computed values
  const formattedPrice = useMemo(() =>
    formatCurrency(course?.price), [course?.price]);

  // 4. Event handlers
  const handleApply = useCallback(() => {
    onApply?.();
  }, [onApply]);

  // 5. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 6. Render
  return <div>{/* JSX */}</div>;
};
```

### 3. API 호출 규칙
```typescript
// services/courseService.ts
import { apiClient } from '@/lib/apiClient';

export const courseService = {
  getList: (params: CourseListQuery) =>
    apiClient.get<CourseListResponse>('/courses', { params }),

  getDetail: (id: string) =>
    apiClient.get<CourseDetailResponse>(`/courses/${id}`),

  apply: (id: string, data: CourseApplyRequest) =>
    apiClient.post<CourseApplyResponse>(`/courses/${id}/apply`, data),
};

// hooks/useCourseDetail.ts
export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getDetail(id),
  });
};
```

## 프로젝트별 특화 규칙

### 1. 결제/정산 처리
```typescript
// 금액 계산은 반드시 서버에서 처리
// FE는 계산 결과만 표시

// 정산 계산 예시 (BE)
const calculateSettlement = (grossAmount: number, feeRate: number) => {
  const feeAmount = Math.floor(grossAmount * (feeRate / 100));
  const netAmount = grossAmount - feeAmount;
  return { grossAmount, feeAmount, netAmount };
};

// 금액 표시 (FE)
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ko-KR').format(amount) + '원';
```

### 2. 상태 관리 패턴
```typescript
// 인증 상태 (Zustand)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 서버 상태 (React Query)
// - 목록 데이터
// - 상세 데이터
// - 캐싱이 필요한 데이터
```

### 3. 실시간 데이터 처리
```typescript
// Supabase Realtime 구독
useEffect(() => {
  const channel = supabase
    .channel(`course:${courseId}:announcements`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'course_announcements',
      filter: `course_id=eq.${courseId}`,
    }, (payload) => {
      // 새 공지사항 처리
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [courseId]);
```

## API 응답 형식

```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// 에러 응답
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

## 환경 변수

### Frontend (.env)
```
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_IMP_CODE=
```

### Backend (.env)
```
NODE_ENV=
PORT=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
NAVER_PAY_CLIENT_ID=
NAVER_PAY_CLIENT_SECRET=
REDIS_URL=
```

## 개발 명령어

```bash
# Frontend
cd client
npm run dev          # 개발 서버
npm run build        # 빌드
npm run preview      # 빌드 미리보기

# Backend
cd server
npm run dev          # 개발 서버 (nodemon)
npm run build        # TypeScript 빌드
npm run start        # 프로덕션 서버
npm run test         # 테스트

# Database
npx supabase db push       # 마이그레이션 적용
npx supabase db reset      # DB 리셋
npx supabase gen types     # 타입 생성
```

## 주의사항

### ❌ 금지 사항
- **console.log 운영 코드 포함 금지** (logger 사용)
- **any 타입 사용 금지**
- **하드코딩된 금액/수수료율 금지** (DB 설정 사용)
- **클라이언트에서 직접 DB 조작 금지**
- **민감 정보 클라이언트 노출 금지**

### ✅ 준수 사항
- **모든 API는 인증 미들웨어 적용**
- **결제 관련 로직은 트랜잭션 사용**
- **에러 처리는 중앙 집중화**
- **환경 변수로 설정 관리**
- **Row Level Security 정책 적용**

## 문서

- [정보구조도](./docs/INFORMATION_ARCHITECTURE.md)
- [화면명세서](./docs/SCREEN_SPECIFICATIONS.md)
- [API명세서](./docs/API_SPECIFICATION.md)
- [DB스키마](./docs/DATABASE_SCHEMA.md)
- [아키텍처](./docs/ARCHITECTURE.md)
- [시뮬레이션검증](./docs/SIMULATION_VERIFICATION.md)
