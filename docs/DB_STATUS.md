# 데이터베이스 현황 (DB Status)

**프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
**Supabase URL**: https://zzzbutkqawmthuubilfx.supabase.co
**최종 업데이트**: 2025-01-18

---

> **관련 문서**
> - [전체 사이트 구조](./PROJECT_STRUCTURE.md)
> - [DB 스키마 상세](./DATABASE_SCHEMA.md)
> - [API 명세서](./API_SPECIFICATION.md)
> - [백엔드 설정 가이드](./BACKEND_SETUP_GUIDE.md)

---

## 1. Supabase 연결 정보

```
Project URL: https://zzzbutkqawmthuubilfx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emJ1dGtxYXdtdGh1dWJpbGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTIzNjksImV4cCI6MjA3OTA2ODM2OX0.Y5dGlpk_z8I4w3ARxRq-52p8YS5DdBy28Rfw3yInXSU
Service Key: (Supabase Dashboard > Settings > API 에서 확인)
```

---

## 2. 테이블 목록 (27개)

### 2.1 사용자 관련
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `profiles` | 사용자 프로필 | id, email, phone, name, nickname, role, status |
| `influencer_profiles` | 인플루언서 추가 정보 | user_id, display_name, bank_account, verification_status |

### 2.2 코스 관련
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `courses` | 여행 코스 | influencer_id, title, country, city, price, status |
| `course_days` | 일자별 일정 | course_id, day_number, date, title |
| `course_day_items` | 일정 상세 항목 | course_day_id, time_slot, title, location_name |
| `course_applications` | 코스 신청 | course_id, user_id, status, payment_id |
| `course_participants_expenses` | 참가자 경비 | course_id, user_id, balance, total_charged |
| `expense_transactions` | 경비 거래 내역 | expense_id, type, amount, balance_after |
| `course_nbang_items` | N빵 정산 항목 | course_id, title, total_amount, per_person_amount |
| `course_nbang_participants` | N빵 참여자 | nbang_item_id, user_id, amount, is_paid |
| `course_announcements` | 코스 공지사항 | course_id, author_id, title, content |
| `announcement_comments` | 공지사항 댓글 | announcement_id, user_id, content |

### 2.3 파티 관련
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `parties` | 파티/이벤트 | influencer_id, title, event_date, price, status |
| `party_applications` | 파티 신청 | party_id, user_id, status, payment_id |

### 2.4 결제/정산 관련
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `payments` | 결제 내역 | user_id, payment_type, reference_type, reference_id, amount, status |
| `settlements` | 정산 내역 | influencer_id, settlement_type, gross_amount, fee_amount, net_amount, status |

### 2.5 커뮤니케이션
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `direct_messages` | 1:1 메시지 | sender_id, receiver_id, content, is_read |
| `notifications` | 알림 | user_id, type, title, message, is_read |
| `inquiries` | 1:1 문의 | user_id, category, title, content, status |
| `inquiry_responses` | 문의 답변 | inquiry_id, responder_id, content |

### 2.6 후기/기록
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `reviews` | 후기 | user_id, review_type, reference_id, rating, content, status |
| `travel_records` | 여행 기록 | course_id, user_id, title, content, visibility |

### 2.7 관리자
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `admin_settings` | 관리자 설정 | key, value, description |
| `fee_history` | 수수료 변경 이력 | influencer_id, fee_type, old_rate, new_rate |
| `reports` | 신고 | reporter_id, target_type, target_id, reason, status |

### 2.8 기타
| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `banners` | 메인 배너 | title, image_url, link_url, is_active |
| `notices` | 서비스 공지 | title, content, is_important |
| `faqs` | 자주 묻는 질문 | category, question, answer |
| `user_favorites` | 찜/좋아요 | user_id, target_type, target_id |

---

## 3. Storage 버킷 (5개)

| 버킷 이름 | Public | 용도 | 파일 크기 제한 |
|-----------|--------|------|----------------|
| `avatars` | ✅ Yes | 프로필 이미지 | 5MB |
| `courses` | ✅ Yes | 코스 이미지/동영상 | 10MB |
| `parties` | ✅ Yes | 파티 이미지/동영상 | 10MB |
| `records` | ✅ Yes | 여행 기록 이미지/동영상 | 20MB |
| `attachments` | ❌ No | 문의 첨부파일 (비공개) | 10MB |

### Storage 정책
- **SELECT**: Public 버킷은 모든 사용자가 조회 가능, attachments는 본인 파일만
- **INSERT**: 인증된 사용자만 업로드 가능
- **UPDATE/DELETE**: 본인 파일만 수정/삭제 가능 (폴더 경로로 확인)

---

## 4. RLS (Row Level Security) 정책

### 4.1 헬퍼 함수
```sql
is_admin()              -- 현재 사용자가 admin인지 확인
is_influencer()         -- 현재 사용자가 influencer인지 확인
get_user_role()         -- 현재 사용자 역할 반환
get_my_influencer_id()  -- 현재 사용자의 influencer_profiles.id 반환
```

### 4.2 주요 정책 패턴

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| profiles | 본인 | 본인 | 본인 | - |
| influencer_profiles | 승인된 인플루언서 or 본인 | 본인 | 본인 | - |
| courses | 공개 코스 or 본인 | 인플루언서 | 인플루언서 (본인) | 인플루언서 (본인) |
| course_applications | 본인 or 해당 인플루언서 | 유저 | 유저/인플루언서 | - |
| payments | 본인 or 해당 인플루언서 | 시스템 | - | - |
| settlements | 본인 인플루언서 | 시스템 | Admin | - |
| notifications | 본인 | 시스템 | 본인 | 본인 |
| reviews | 공개 or 본인 | 유저 | 유저 (본인) | 유저 (본인) |
| inquiries | 본인 or 관련 인플루언서 | 유저 | 유저/인플루언서 | - |

---

## 5. 주요 상태값 (Status)

### 5.1 코스/파티 상태 (status)
- `draft` - 초안
- `recruiting` - 모집중
- `closed` - 모집마감
- `ongoing` - 진행중
- `completed` - 완료
- `cancelled` - 취소됨

### 5.2 신청 상태 (status)
- `pending` - 대기중
- `confirmed` - 확정
- `rejected` - 거절
- `cancelled` - 취소

### 5.3 결제 상태 (status)
- `pending` - 대기
- `completed` - 완료
- `failed` - 실패
- `refunded` - 환불됨
- `partial_refunded` - 부분환불

### 5.4 정산 상태 (status)
- `pending` - 대기
- `processing` - 처리중
- `completed` - 완료
- `failed` - 실패

### 5.5 인플루언서 인증 상태 (verification_status)
- `pending` - 심사대기
- `verified` - 승인
- `rejected` - 거부

### 5.6 사용자 역할 (role)
- `user` - 일반 사용자
- `influencer` - 인플루언서
- `admin` - 관리자

---

## 6. 뷰 (Views)

| 뷰 이름 | 설명 |
|---------|------|
| `v_course_details` | 코스 상세 + 인플루언서 정보 + 통계 |
| `v_settlement_summary` | 인플루언서별 정산 요약 |
| `v_party_details` | 파티 상세 + 인플루언서 정보 + 통계 |

---

## 7. 트리거 및 함수

### 7.1 자동 트리거
- `update_updated_at()` - 모든 테이블의 updated_at 자동 갱신
- `update_participant_count()` - 신청 상태 변경 시 참가자 수 자동 업데이트
- `handle_new_user()` - 회원가입 시 profiles 자동 생성
- `calculate_expense_balance()` - 경비 거래 시 잔액 자동 계산

### 7.2 통계 함수
- `update_influencer_stats()` - 인플루언서 통계 업데이트 (total_courses, total_participants, average_rating)

---

## 8. 인덱스

### 8.1 주요 인덱스
```sql
idx_profiles_role              -- 역할별 조회
idx_courses_status             -- 상태별 코스 조회
idx_courses_dates              -- 날짜 범위 조회
idx_courses_location           -- 지역별 조회
idx_course_apps_status         -- 신청 상태별 조회
idx_payments_status            -- 결제 상태별 조회
idx_notifications_user_unread  -- 안읽은 알림 조회
```

### 8.2 복합 인덱스
```sql
idx_courses_search             -- 코스 검색 (status, country, city, start_date)
idx_apps_user_status           -- 사용자별 신청 상태
```

---

## 9. 기본 설정값 (admin_settings)

| Key | Value | 설명 |
|-----|-------|------|
| default_course_fee_rate | 10 | 기본 코스 수수료율 (%) |
| default_party_fee_rate | 10 | 기본 파티 수수료율 (%) |
| pg_fee_rate | 3.3 | PG 수수료율 (%) |
| min_expense_charge | 50000 | 최소 경비 충전 금액 |
| platform_terms_version | "1.0" | 이용약관 버전 |
| refund_policy_version | "1.0" | 환불정책 버전 |

---

## 10. 마이그레이션 파일

| 파일 | 설명 | 실행 상태 |
|------|------|-----------|
| `001_initial_schema.sql` | 테이블, 함수, 트리거, 기본 데이터 | ✅ 완료 |
| `002_rls_policies.sql` | RLS 정책 | ✅ 완료 |
| `003_storage_setup.sql` | Storage 버킷 (Dashboard에서 수동 생성) | ✅ 완료 |

---

## 11. 유지보수 참고

### 11.1 테이블 추가 시
1. `001_initial_schema.sql`에 테이블 정의 추가
2. `002_rls_policies.sql`에 RLS 정책 추가
3. 이 문서에 테이블 정보 추가

### 11.2 버킷 추가 시
1. Supabase Dashboard에서 버킷 생성
2. SQL Editor에서 정책 추가
3. 이 문서에 버킷 정보 추가

### 11.3 백업
- Supabase 자동 백업: 일 1회
- 수동 백업: `pg_dump $DATABASE_URL > backup.sql`
