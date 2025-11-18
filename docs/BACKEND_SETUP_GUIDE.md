# 백엔드 설정 가이드

## 1. Supabase SQL 에디터에서 실행할 SQL

Supabase Dashboard > SQL Editor에서 아래 파일들을 순서대로 실행하세요:

### 실행 순서
1. `server/supabase/migrations/001_initial_schema.sql` - 테이블, 함수, 트리거
2. `server/supabase/migrations/002_rls_policies.sql` - RLS 정책
3. `server/supabase/migrations/003_storage_setup.sql` - Storage 버킷

---

## 2. Storage 버킷 수동 생성 (대시보드에서)

Supabase Dashboard > Storage에서 아래 버킷들을 생성하세요:

| 버킷 이름 | Public | 설명 |
|-----------|--------|------|
| **avatars** | ✅ Yes | 프로필 이미지 |
| **courses** | ✅ Yes | 코스 이미지/동영상 |
| **parties** | ✅ Yes | 파티 이미지/동영상 |
| **records** | ✅ Yes | 여행 기록 이미지/동영상 |
| **attachments** | ❌ No | 문의 첨부파일 (비공개) |

### 버킷별 설정
```
avatars:
  - Public: ON
  - File size limit: 5MB
  - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

courses:
  - Public: ON
  - File size limit: 10MB
  - Allowed MIME types: image/*, video/mp4, video/webm

parties:
  - Public: ON
  - File size limit: 10MB
  - Allowed MIME types: image/*, video/mp4, video/webm

records:
  - Public: ON
  - File size limit: 20MB
  - Allowed MIME types: image/*, video/mp4, video/webm

attachments:
  - Public: OFF
  - File size limit: 10MB
  - Allowed MIME types: image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.*
```

---

## 3. PowerShell 명령어

### 3.1 프로젝트 클론 및 설정
```powershell
# 프로젝트 폴더로 이동
cd C:\Users\USER\Desktop\gemini\in

# Git pull (최신 코드 가져오기)
git pull origin claude/create-project-docs-01Y2Fo26zkPf8n9EffTRw7XD

# 백엔드 폴더로 이동
cd server

# 의존성 설치
npm install
```

### 3.2 환경 변수 설정
```powershell
# .env 파일 확인 (이미 생성됨)
# 아래 값들을 실제 값으로 수정 필요:
# - SUPABASE_SERVICE_KEY: Supabase Dashboard > Settings > API > service_role key
# - JWT_SECRET: 32자 이상의 랜덤 문자열
# - IMP_KEY, IMP_SECRET: 아임포트 관리자 콘솔에서 확인
```

### 3.3 백엔드 서버 실행
```powershell
# 개발 모드 실행 (포트 3000)
npm run dev

# 또는 빌드 후 실행
npm run build
npm start
```

### 3.4 프론트엔드 실행 (별도 터미널)
```powershell
# 루트 폴더로 이동
cd C:\Users\USER\Desktop\gemini\in

# 프론트엔드 실행 (포트 5100)
npm run dev
```

---

## 4. Supabase Service Role Key 얻기

1. Supabase Dashboard 접속: https://supabase.com/dashboard
2. 프로젝트 선택
3. Settings > API
4. **service_role** 키 복사 (secret으로 표시됨)
5. `/server/.env` 파일의 `SUPABASE_SERVICE_KEY`에 붙여넣기

⚠️ **주의**: service_role 키는 절대 클라이언트에 노출하지 마세요!

---

## 5. 전체 테이블 목록 (27개)

### 사용자 관련
- `profiles` - 사용자 프로필
- `influencer_profiles` - 인플루언서 추가 정보

### 코스 관련
- `courses` - 여행 코스
- `course_days` - 일자별 일정
- `course_day_items` - 일정 상세 항목
- `course_applications` - 코스 신청
- `course_participants_expenses` - 참가자 경비
- `expense_transactions` - 경비 거래 내역
- `course_nbang_items` - N빵 정산 항목
- `course_nbang_participants` - N빵 참여자
- `course_announcements` - 코스 공지사항
- `announcement_comments` - 공지사항 댓글

### 파티 관련
- `parties` - 파티/이벤트
- `party_applications` - 파티 신청

### 결제/정산 관련
- `payments` - 결제 내역
- `settlements` - 정산 내역

### 커뮤니케이션
- `direct_messages` - 1:1 메시지
- `notifications` - 알림
- `inquiries` - 1:1 문의
- `inquiry_responses` - 문의 답변

### 후기/기록
- `reviews` - 후기
- `travel_records` - 여행 기록

### 관리자
- `admin_settings` - 관리자 설정
- `fee_history` - 수수료 변경 이력
- `reports` - 신고

### 기타
- `banners` - 메인 배너
- `notices` - 서비스 공지
- `faqs` - 자주 묻는 질문
- `user_favorites` - 찜/좋아요

---

## 6. API 엔드포인트 요약 (53개)

### 인증 (4개)
- `POST /api/auth/kakao` - 카카오 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/identity-verification` - 본인인증
- `POST /api/auth/logout` - 로그아웃

### 사용자 (7개)
- `POST /api/users/terms-agreement` - 약관 동의
- `GET /api/users/check-nickname` - 닉네임 중복 확인
- `POST /api/users/profile` - 프로필 저장
- `GET /api/users/me` - 내 프로필 조회
- `PUT /api/users/me` - 프로필 수정
- `PUT /api/users/me/notifications` - 알림 설정
- `DELETE /api/users/me` - 회원 탈퇴

### 코스 (7개)
- `GET /api/courses` - 코스 목록
- `GET /api/courses/featured` - 추천 코스
- `GET /api/courses/:id` - 코스 상세
- `POST /api/courses/:id/apply` - 코스 신청
- `GET /api/courses/:id/announcements` - 공지사항
- `GET /api/courses/:id/my-expenses` - 내 경비
- `POST /api/courses/:id/charge-expense` - 경비 충전

### 파티 (3개)
- `GET /api/parties` - 파티 목록
- `GET /api/parties/:id` - 파티 상세
- `POST /api/parties/:id/apply` - 파티 신청

### 내 정보 (5개)
- `GET /api/my/applications` - 내 신청 목록
- `GET /api/my/active-travels` - 진행 중 여행
- `GET /api/my/payments` - 결제 내역
- `GET /api/my/reviews` - 내 후기
- `GET /api/my/inquiries` - 내 문의

### 인플루언서 (10개)
- `POST /api/influencer/courses` - 코스 생성
- `PUT /api/influencer/courses/:id` - 코스 수정
- `GET /api/influencer/courses/:id/applications` - 신청자 목록
- `PUT /api/influencer/applications/:id/select` - 신청자 선정
- `PUT /api/influencer/applications/:id/reject` - 신청자 미선정
- `POST /api/influencer/courses/:id/close-recruitment` - 모집 마감
- `POST /api/influencer/courses/:id/request-expense` - 경비 충전 요청
- `POST /api/influencer/courses/:id/nbang-items` - N빵 항목 추가
- `POST /api/influencer/courses/:id/announcements` - 공지사항 작성
- `GET /api/influencer/settlements` - 정산 내역

### 결제 (2개)
- `POST /api/payments/complete` - 결제 완료 처리
- `GET /api/payments/:id` - 결제 상세

### 관리자 (10개)
- `GET /api/admin/influencer-applications` - 인플루언서 신청 목록
- `PUT /api/admin/influencer-applications/:id/approve` - 승인
- `PUT /api/admin/influencer-applications/:id/reject` - 반려
- `GET /api/admin/payments` - 전체 결제 내역
- `POST /api/admin/payments/:id/refund` - 환불 처리
- `GET /api/admin/settlements` - 전체 정산 목록
- `PUT /api/admin/settlements/:id/approve` - 정산 승인
- `GET /api/admin/settings/fees` - 수수료 설정 조회
- `PUT /api/admin/settings/fees` - 수수료 설정 변경
- `GET /api/admin/analytics` - 통계

### 문의 (4개)
- `POST /api/inquiries` - 문의 등록
- `GET /api/inquiries` - 문의 목록
- `GET /api/inquiries/:id` - 문의 상세
- `POST /api/inquiries/:id/respond` - 답변

---

## 7. 다음 단계

### 필수 작업
1. Supabase에서 SQL 마이그레이션 실행
2. Storage 버킷 생성
3. `.env` 파일에 실제 키 입력
4. `npm install` 및 `npm run dev`

### 추가 구현 필요
1. 결제 연동 (아임포트/네이버페이)
2. 소셜 로그인 연동 (카카오/네이버/애플)
3. 본인인증 연동
4. 푸시 알림 구현
5. 이메일/SMS 발송 구현

---

## 8. 테스트 체크리스트

### 유저 플로우 (3회 테스트)
- [ ] 소셜 로그인 → 약관 동의 → 프로필 설정
- [ ] 코스 상세 조회 → 신청 → 결제
- [ ] 선정 후 경비 충전 → 공지 확인 → 채팅
- [ ] 여행 종료 후 후기 작성

### 인플루언서 플로우 (3회 테스트)
- [ ] 인플루언서 신청 → 승인 대기
- [ ] 코스 생성 → 공유 링크 복사
- [ ] 신청자 확인 → 선정/미선정
- [ ] 경비 충전 요청 → N빵 정산
- [ ] 여행 완료 → 정산 확인

### 관리자 플로우 (3회 테스트)
- [ ] 인플루언서 승인/반려
- [ ] 결제 내역 확인 → 환불 처리
- [ ] 정산 승인 → 지급 완료 처리
- [ ] 수수료 설정 변경
- [ ] 통계 확인
