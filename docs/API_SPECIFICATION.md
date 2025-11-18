# API 명세서 (API Specification)

**프로젝트명**: 인플루언서 맞춤형 공동 여행 플랫폼
**Base URL**: `https://api.travel-platform.com/api/v1`
**문서 버전**: 1.0
**작성일**: 2025-01-18

---

## 공통 사항

### 인증 헤더
```
Authorization: Bearer {access_token}
```

### 응답 형식

**성공 응답**:
```json
{
  "success": true,
  "data": { /* 실제 데이터 */ },
  "message": "성공 메시지 (선택)",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

**실패 응답**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자 친화적 오류 메시지"
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

### 에러 코드

| 코드 | 설명 |
|------|------|
| AUTH_INVALID_TOKEN | 유효하지 않은 토큰 |
| AUTH_TOKEN_EXPIRED | 토큰 만료 |
| AUTH_UNAUTHORIZED | 권한 없음 |
| VALIDATION_ERROR | 입력값 검증 오류 |
| NOT_FOUND | 리소스 없음 |
| ALREADY_EXISTS | 이미 존재 |
| PAYMENT_FAILED | 결제 실패 |
| SERVER_ERROR | 서버 오류 |

---

## 1. 인증 API (Auth)

### 1.1 카카오 로그인
- **Endpoint**: `POST /auth/kakao`
- **설명**: 카카오 OAuth 인증

**Request**:
```json
{
  "access_token": "kakao_access_token"
}
```

**Response (성공)**:
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@email.com",
      "is_new_user": true,
      "profile_completed": false
    }
  }
}
```

---

### 1.2 토큰 갱신
- **Endpoint**: `POST /auth/refresh`
- **설명**: Access Token 갱신

**Request**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "new_jwt_access_token",
    "expires_in": 900
  }
}
```

---

### 1.3 본인인증
- **Endpoint**: `POST /auth/identity-verification`
- **설명**: 휴대폰 본인인증 완료 처리

**Request**:
```json
{
  "imp_uid": "아임포트_인증_uid",
  "name": "홍길동",
  "phone": "01012345678",
  "birth_date": "1990-01-01",
  "gender": "male"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "verified": true
  }
}
```

---

### 1.4 로그아웃
- **Endpoint**: `POST /auth/logout`
- **설명**: 로그아웃 (토큰 무효화)

**Response**:
```json
{
  "success": true,
  "message": "로그아웃 되었습니다"
}
```

---

## 2. 사용자 API (Users)

### 2.1 약관 동의
- **Endpoint**: `POST /users/terms-agreement`
- **설명**: 이용약관 동의 저장

**Request**:
```json
{
  "service_terms": true,
  "privacy_policy": true,
  "third_party_sharing": true,
  "marketing": false
}
```

---

### 2.2 닉네임 중복 확인
- **Endpoint**: `GET /users/check-nickname`
- **설명**: 닉네임 사용 가능 여부 확인

**Query Parameters**:
- `nickname`: 확인할 닉네임

**Response**:
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

---

### 2.3 프로필 저장
- **Endpoint**: `POST /users/profile`
- **설명**: 초기 프로필 설정

**Request**:
```json
{
  "nickname": "여행러버",
  "avatar_url": "https://storage.../avatar.jpg",
  "birth_date": "1990-01-01",
  "gender": "male"
}
```

---

### 2.4 프로필 조회
- **Endpoint**: `GET /users/me`
- **설명**: 내 프로필 조회

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@email.com",
    "nickname": "여행러버",
    "avatar_url": "...",
    "phone": "01012345678",
    "instagram_url": "...",
    "birth_date": "1990-01-01",
    "gender": "male",
    "role": "user",
    "notification_settings": {
      "push": true,
      "email": true,
      "sms": false
    }
  }
}
```

---

### 2.5 프로필 수정
- **Endpoint**: `PUT /users/me`
- **설명**: 프로필 정보 수정

**Request**:
```json
{
  "nickname": "새닉네임",
  "avatar_url": "...",
  "instagram_url": "https://instagram.com/..."
}
```

---

### 2.6 알림 설정 수정
- **Endpoint**: `PUT /users/me/notifications`
- **설명**: 알림 수신 설정 변경

**Request**:
```json
{
  "push": true,
  "email": false,
  "sms": false
}
```

---

### 2.7 회원 탈퇴
- **Endpoint**: `DELETE /users/me`
- **설명**: 회원 탈퇴

**Request**:
```json
{
  "reason": "사용 빈도 낮음",
  "feedback": "추가 의견..."
}
```

---

## 3. 코스 API (Courses)

### 3.1 코스 목록 조회
- **Endpoint**: `GET /courses`
- **설명**: 공개된 코스 목록

**Query Parameters**:
- `status`: 상태 (recruiting, ongoing)
- `country`: 국가
- `page`: 페이지 번호
- `limit`: 페이지당 개수

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "발리 5박 6일 힐링 여행",
        "thumbnail_url": "...",
        "country": "인도네시아",
        "city": "발리",
        "start_date": "2025-03-01",
        "end_date": "2025-03-06",
        "price": 1500000,
        "max_participants": 10,
        "current_participants": 3,
        "status": "recruiting",
        "influencer": {
          "id": "uuid",
          "display_name": "여행왕",
          "avatar_url": "..."
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

### 3.2 추천 코스 목록
- **Endpoint**: `GET /courses/featured`
- **설명**: 메인 화면용 추천 코스

**Response**: 코스 목록과 동일 형식

---

### 3.3 코스 상세 조회
- **Endpoint**: `GET /courses/:id`
- **설명**: 코스 전체 정보

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "발리 5박 6일 힐링 여행",
    "description": "...",
    "thumbnail_url": "...",
    "images": ["...", "..."],
    "country": "인도네시아",
    "city": "발리",
    "start_date": "2025-03-01",
    "end_date": "2025-03-06",
    "total_days": 6,
    "recruitment_start": "2025-01-15",
    "recruitment_end": "2025-02-15",
    "min_participants": 5,
    "max_participants": 10,
    "current_participants": 3,
    "allowed_gender": "all",
    "min_age": 20,
    "max_age": 40,
    "price": 1500000,
    "included_items": [
      {"name": "숙박비", "description": "5박 리조트 숙박"}
    ],
    "optional_items": [
      {"name": "스노클링", "description": "선택 액티비티", "price": 50000}
    ],
    "accommodation": {
      "name": "발리 리조트",
      "description": "...",
      "address": "...",
      "map_url": "https://maps.google.com/...",
      "images": ["..."]
    },
    "refund_policy": "...",
    "status": "recruiting",
    "influencer": {
      "id": "uuid",
      "display_name": "여행왕",
      "avatar_url": "...",
      "instagram_url": "...",
      "average_rating": 4.8
    },
    "days": [
      {
        "day_number": 1,
        "date": "2025-03-01",
        "title": "도착 및 휴식",
        "items": [
          {
            "order_index": 1,
            "time_slot": "14:00",
            "title": "공항 도착",
            "description": "...",
            "location_name": "발리 국제공항",
            "map_url": "..."
          }
        ]
      }
    ],
    "is_applied": false,
    "can_apply": true
  }
}
```

---

### 3.4 코스 신청
- **Endpoint**: `POST /courses/:id/apply`
- **설명**: 코스 참가 신청

**Request**:
```json
{
  "applicant_name": "홍길동",
  "phone": "01012345678",
  "instagram_url": "https://instagram.com/...",
  "age": 30,
  "gender": "male",
  "introduction": "자기소개..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "application_id": "uuid",
    "payment_request": {
      "merchant_uid": "order_123",
      "amount": 1500000,
      "name": "발리 5박 6일 힐링 여행"
    }
  }
}
```

---

### 3.5 내 신청 목록
- **Endpoint**: `GET /my/applications`
- **설명**: 내가 신청한 코스/파티 목록

**Query Parameters**:
- `type`: course / party

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "course": {
          "id": "uuid",
          "title": "...",
          "thumbnail_url": "...",
          "start_date": "...",
          "end_date": "..."
        },
        "status": "pending",
        "applied_at": "2025-01-18T10:00:00Z",
        "paid_amount": 1500000
      }
    ]
  }
}
```

---

### 3.6 내 진행 중 여행 목록
- **Endpoint**: `GET /my/active-travels`
- **설명**: 참가 확정된 진행 중 여행

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "course": {
          "id": "uuid",
          "title": "...",
          "thumbnail_url": "...",
          "start_date": "2025-03-01",
          "end_date": "2025-03-06"
        },
        "has_new_announcement": true,
        "expense_balance": 300000
      }
    ]
  }
}
```

---

### 3.7 공지사항 목록
- **Endpoint**: `GET /courses/:id/announcements`
- **설명**: 코스 공지사항 조회

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "첫 번째 공지",
        "content": "...",
        "images": ["..."],
        "is_pinned": true,
        "created_at": "2025-01-18T10:00:00Z",
        "comment_count": 5
      }
    ]
  }
}
```

---

### 3.8 공지사항 댓글 작성
- **Endpoint**: `POST /announcements/:id/comments`
- **설명**: 공지사항에 댓글 작성

**Request**:
```json
{
  "content": "댓글 내용"
}
```

---

### 3.9 내 경비 조회
- **Endpoint**: `GET /courses/:id/my-expenses`
- **설명**: 내 경비 잔액 및 거래 내역

**Response**:
```json
{
  "success": true,
  "data": {
    "balance": 300000,
    "total_charged": 500000,
    "total_used": 200000,
    "requested_amount": 500000,
    "transactions": [
      {
        "id": "uuid",
        "type": "charge",
        "amount": 500000,
        "balance_after": 500000,
        "description": "경비 충전",
        "created_at": "..."
      },
      {
        "id": "uuid",
        "type": "deduct",
        "amount": -100000,
        "balance_after": 400000,
        "description": "스노클링 N빵",
        "created_at": "..."
      }
    ]
  }
}
```

---

### 3.10 경비 충전
- **Endpoint**: `POST /courses/:id/charge-expense`
- **설명**: 경비 충전 결제

**Request**:
```json
{
  "amount": 300000
}
```

**Response**: 결제 요청 정보 반환

---

## 4. 파티 API (Parties)

### 4.1 파티 목록
- **Endpoint**: `GET /parties`
- **설명**: 파티 목록 조회

**Query Parameters**:
- `region`: 지역
- `date_from`: 시작 날짜
- `date_to`: 종료 날짜
- `page`, `limit`

---

### 4.2 파티 상세
- **Endpoint**: `GET /parties/:id`
- **설명**: 파티 상세 정보

---

### 4.3 파티 신청
- **Endpoint**: `POST /parties/:id/apply`
- **설명**: 파티 참가 신청

**Request**: 코스 신청과 동일 형식

---

## 5. 인플루언서 API (Influencers)

### 5.1 인플루언서 프로필 조회
- **Endpoint**: `GET /influencers/:id`
- **설명**: 인플루언서 공개 프로필

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "display_name": "여행왕",
    "avatar_url": "...",
    "category": "여행",
    "follower_count": 50000,
    "description": "...",
    "sns_links": [
      {"platform": "instagram", "url": "..."}
    ],
    "total_courses": 15,
    "total_parties": 8,
    "average_rating": 4.8
  }
}
```

---

### 5.2 인플루언서 신청
- **Endpoint**: `POST /influencers/apply`
- **설명**: 인플루언서 등록 신청

**Request**:
```json
{
  "display_name": "여행왕",
  "category": "여행",
  "description": "...",
  "instagram_url": "...",
  "follower_count": 50000,
  "bank_name": "신한은행",
  "bank_account": "110123456789",
  "account_holder": "홍길동",
  "business_number": "123-45-67890"
}
```

---

### 5.3 코스 생성 (인플루언서)
- **Endpoint**: `POST /influencer/courses`
- **설명**: 새 코스 등록

**Request**: 코스 상세 정보 전체

---

### 5.4 신청자 목록 (인플루언서)
- **Endpoint**: `GET /influencer/courses/:id/applications`
- **설명**: 코스 신청자 목록

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "pending": 20,
      "confirmed": 5,
      "rejected": 3,
      "max_participants": 10
    },
    "items": [
      {
        "id": "uuid",
        "applicant_name": "김철수",
        "phone": "01012345678",
        "instagram_url": "...",
        "age": 28,
        "gender": "male",
        "introduction": "...",
        "status": "pending",
        "applied_at": "..."
      }
    ]
  }
}
```

---

### 5.5 신청자 선정 (인플루언서)
- **Endpoint**: `PUT /influencer/applications/:id/select`
- **설명**: 신청자 선정 처리

---

### 5.6 신청자 미선정 (인플루언서)
- **Endpoint**: `PUT /influencer/applications/:id/reject`
- **설명**: 신청자 미선정 처리

---

### 5.7 모집 마감 (인플루언서)
- **Endpoint**: `POST /influencer/courses/:id/close-recruitment`
- **설명**: 모집 마감 및 미선정자 일괄 환불

---

### 5.8 경비 충전 요청 (인플루언서)
- **Endpoint**: `POST /influencer/courses/:id/request-expense`
- **설명**: 참가자들에게 경비 충전 요청

**Request**:
```json
{
  "requested_amount": 500000
}
```

---

### 5.9 N빵 항목 추가 (인플루언서)
- **Endpoint**: `POST /influencer/courses/:id/nbang-items`
- **설명**: N빵 정산 항목 추가

**Request**:
```json
{
  "title": "스노클링 투어",
  "total_amount": 400000,
  "participant_ids": ["uuid1", "uuid2", "uuid3", "uuid4"],
  "include_fee_in_amount": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "per_person_amount": 100000,
    "participant_count": 4,
    "insufficient_balance_users": []
  }
}
```

---

### 5.10 공지사항 작성 (인플루언서)
- **Endpoint**: `POST /influencer/courses/:id/announcements`
- **설명**: 코스 공지사항 작성

**Request**:
```json
{
  "title": "공지 제목",
  "content": "공지 내용",
  "images": ["..."],
  "is_pinned": false
}
```

---

### 5.11 정산 내역 조회 (인플루언서)
- **Endpoint**: `GET /influencer/settlements`
- **설명**: 내 정산 내역

**Query Parameters**:
- `status`: pending / completed
- `from_date`, `to_date`
- `page`, `limit`

---

## 6. 결제 API (Payments)

### 6.1 결제 완료 처리
- **Endpoint**: `POST /payments/complete`
- **설명**: PG 결제 완료 후 처리

**Request**:
```json
{
  "imp_uid": "아임포트_결제_uid",
  "merchant_uid": "order_123"
}
```

---

### 6.2 결제 내역 조회
- **Endpoint**: `GET /my/payments`
- **설명**: 내 결제 내역

---

### 6.3 결제 상세
- **Endpoint**: `GET /my/payments/:id`
- **설명**: 결제 상세 정보

---

## 7. 후기 API (Reviews)

### 7.1 후기 작성
- **Endpoint**: `POST /reviews`
- **설명**: 여행/파티 후기 작성

**Request**:
```json
{
  "review_type": "course",
  "reference_id": "uuid",
  "rating": 5,
  "content": "후기 내용...",
  "images": ["..."]
}
```

---

### 7.2 내 후기 목록
- **Endpoint**: `GET /my/reviews`
- **설명**: 내가 작성한 후기

---

### 7.3 후기 수정
- **Endpoint**: `PUT /reviews/:id`
- **설명**: 후기 수정

---

### 7.4 후기 삭제
- **Endpoint**: `DELETE /reviews/:id`
- **설명**: 후기 삭제

---

## 8. 메시지 API (Messages)

### 8.1 대화 목록
- **Endpoint**: `GET /messages`
- **설명**: 1:1 메시지 대화 목록

---

### 8.2 대화 상세
- **Endpoint**: `GET /messages/:conversation_id`
- **설명**: 특정 대화의 메시지들

---

### 8.3 메시지 전송
- **Endpoint**: `POST /messages`
- **설명**: 메시지 전송

**Request**:
```json
{
  "receiver_id": "uuid",
  "content": "메시지 내용",
  "related_type": "course",
  "related_id": "uuid"
}
```

---

### 8.4 메시지 읽음 처리
- **Endpoint**: `PUT /messages/:id/read`
- **설명**: 메시지 읽음 표시

---

## 9. 알림 API (Notifications)

### 9.1 알림 목록
- **Endpoint**: `GET /notifications`
- **설명**: 내 알림 목록

**Query Parameters**:
- `page`, `limit`

---

### 9.2 알림 읽음 처리
- **Endpoint**: `PUT /notifications/:id/read`
- **설명**: 알림 읽음 표시

---

### 9.3 전체 읽음 처리
- **Endpoint**: `PUT /notifications/read-all`
- **설명**: 모든 알림 읽음 처리

---

## 10. 파일 업로드 API (Storage)

### 10.1 이미지 업로드
- **Endpoint**: `POST /storage/upload`
- **설명**: 이미지 파일 업로드

**Request**: `multipart/form-data`
- `file`: 파일
- `folder`: 저장 폴더 (avatars, courses, parties, records)

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://storage.supabase.co/.../image.jpg"
  }
}
```

---

## 11. 관리자 API (Admin)

### 11.1 인플루언서 신청 목록
- **Endpoint**: `GET /admin/influencer-applications`
- **설명**: 심사 대기 인플루언서

---

### 11.2 인플루언서 승인
- **Endpoint**: `PUT /admin/influencer-applications/:id/approve`
- **설명**: 인플루언서 승인

---

### 11.3 인플루언서 반려
- **Endpoint**: `PUT /admin/influencer-applications/:id/reject`
- **설명**: 인플루언서 반려

**Request**:
```json
{
  "reason": "반려 사유"
}
```

---

### 11.4 결제 내역 조회
- **Endpoint**: `GET /admin/payments`
- **설명**: 전체 결제 내역

---

### 11.5 환불 처리
- **Endpoint**: `POST /admin/payments/:id/refund`
- **설명**: 수동 환불 처리

**Request**:
```json
{
  "amount": 1500000,
  "reason": "환불 사유"
}
```

---

### 11.6 정산 목록
- **Endpoint**: `GET /admin/settlements`
- **설명**: 전체 정산 목록

---

### 11.7 정산 승인
- **Endpoint**: `PUT /admin/settlements/:id/approve`
- **설명**: 정산 승인 처리

---

### 11.8 정산 완료
- **Endpoint**: `PUT /admin/settlements/:id/complete`
- **설명**: 지급 완료 처리

---

### 11.9 수수료 설정 조회
- **Endpoint**: `GET /admin/settings/fees`
- **설명**: 수수료 설정 조회

---

### 11.10 수수료 설정 변경
- **Endpoint**: `PUT /admin/settings/fees`
- **설명**: 수수료율 변경

**Request**:
```json
{
  "default_course_fee_rate": 10,
  "default_party_fee_rate": 10,
  "pg_fee_rate": 3.3
}
```

---

### 11.11 인플루언서 개별 수수료 설정
- **Endpoint**: `PUT /admin/influencers/:id/fees`
- **설명**: 특정 인플루언서 수수료율 변경

**Request**:
```json
{
  "custom_course_fee_rate": 8,
  "custom_party_fee_rate": 8
}
```

---

### 11.12 신고 목록
- **Endpoint**: `GET /admin/reports`
- **설명**: 신고 목록

---

### 11.13 신고 처리
- **Endpoint**: `PUT /admin/reports/:id/resolve`
- **설명**: 신고 처리

**Request**:
```json
{
  "action": "warning",
  "resolution": "처리 내용"
}
```

---

### 11.14 사용자 정지
- **Endpoint**: `PUT /admin/users/:id/suspend`
- **설명**: 사용자 정지 처리

---

### 11.15 통계 조회
- **Endpoint**: `GET /admin/analytics`
- **설명**: 통계 데이터

**Query Parameters**:
- `from_date`, `to_date`
- `type`: daily / weekly / monthly

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_users": 5000,
      "new_users": 150,
      "total_revenue": 50000000,
      "total_settlements": 45000000
    },
    "charts": {
      "users": [
        {"date": "2025-01-01", "count": 50},
        {"date": "2025-01-02", "count": 45}
      ],
      "revenue": [
        {"date": "2025-01-01", "amount": 3000000},
        {"date": "2025-01-02", "amount": 2500000}
      ]
    }
  }
}
```

---

## 12. 기타 API

### 12.1 배너 목록
- **Endpoint**: `GET /banners`
- **설명**: 메인 화면 배너

---

### 12.2 공지사항 목록
- **Endpoint**: `GET /notices`
- **설명**: 서비스 공지사항

---

### 12.3 FAQ 목록
- **Endpoint**: `GET /faqs`
- **설명**: 자주 묻는 질문

---

### 12.4 문의 등록
- **Endpoint**: `POST /inquiries`
- **설명**: 1:1 문의 등록

**Request**:
```json
{
  "title": "문의 제목",
  "content": "문의 내용",
  "category": "payment"
}
```

---

### 12.5 내 문의 목록
- **Endpoint**: `GET /my/inquiries`
- **설명**: 내가 등록한 문의

---

### 12.6 여행 기록 작성
- **Endpoint**: `POST /travel-records`
- **설명**: 여행 기록 작성

**Request**:
```json
{
  "course_id": "uuid",
  "title": "기록 제목",
  "content": "기록 내용",
  "images": ["..."],
  "visibility": "public"
}
```

---

## Webhook API

### PG 결제 웹훅
- **Endpoint**: `POST /webhooks/payment`
- **설명**: 네이버페이/아임포트 웹훅 수신

---

## 실시간 API (WebSocket)

### 연결
```javascript
const socket = io('wss://api.travel-platform.com', {
  auth: { token: 'access_token' }
});
```

### 채널
- `notifications`: 실시간 알림
- `messages:{conversation_id}`: 1:1 메시지
- `course:{course_id}:announcements`: 코스 공지사항
