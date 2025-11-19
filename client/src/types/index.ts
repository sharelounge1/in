// ==========================================
// Common Types
// ==========================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ==========================================
// User Types
// ==========================================

export type UserRole = 'user' | 'influencer' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';
export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  instagram_url?: string;
  birth_date?: string;
  gender?: Gender;
  notification_settings?: NotificationSettings;
  created_at: string;
  updated_at?: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface TermsAgreement {
  service_terms: boolean;
  privacy_policy: boolean;
  third_party_sharing: boolean;
  marketing: boolean;
}

export interface ProfileUpdateRequest {
  nickname?: string;
  avatar_url?: string;
  instagram_url?: string;
  birth_date?: string;
  gender?: Gender;
}

export interface WithdrawRequest {
  reason: string;
  feedback?: string;
}

// ==========================================
// Influencer Types
// ==========================================

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface InfluencerProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  category: string;
  description?: string;
  instagram_url?: string;
  youtube_url?: string;
  follower_count: number;
  verification_status: VerificationStatus;
  bank_name?: string;
  bank_account?: string;
  account_holder?: string;
  fee_rate: number;
  total_courses?: number;
  total_parties?: number;
  average_rating?: number;
  avatar_url?: string;
  sns_links?: SnsLink[];
  created_at?: string;
}

export interface SnsLink {
  platform: string;
  url: string;
}

export interface InfluencerApplicationRequest {
  display_name: string;
  category: string;
  description: string;
  instagram_url?: string;
  youtube_url?: string;
  follower_count: number;
  bank_name: string;
  bank_account: string;
  account_holder: string;
  business_number?: string;
}

// ==========================================
// Course Types
// ==========================================

export type CourseStatus = 'draft' | 'recruiting' | 'closed' | 'ongoing' | 'completed' | 'cancelled';
export type AllowedGender = 'all' | 'male' | 'female';

export interface Course {
  id: string;
  influencer_id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  images?: string[];
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  total_days?: number;
  price: number;
  min_participants: number;
  max_participants: number;
  current_participants: number;
  status: CourseStatus;
  recruitment_start: string;
  recruitment_end: string;
  allowed_gender?: AllowedGender;
  min_age?: number;
  max_age?: number;
  influencer?: CourseInfluencer;
  created_at?: string;
  updated_at?: string;
}

export interface CourseInfluencer {
  id: string;
  display_name: string;
  avatar_url?: string;
  instagram_url?: string;
  average_rating?: number;
}

export interface CourseDetail extends Course {
  included_items?: CourseItem[];
  optional_items?: OptionalItem[];
  accommodation?: Accommodation;
  refund_policy?: string;
  days?: CourseDay[];
  is_applied?: boolean;
  can_apply?: boolean;
}

export interface CourseItem {
  name: string;
  description?: string;
}

export interface OptionalItem {
  name: string;
  description?: string;
  price: number;
}

export interface Accommodation {
  name: string;
  description?: string;
  address?: string;
  map_url?: string;
  images?: string[];
}

export interface CourseDay {
  day_number: number;
  date: string;
  title: string;
  items: CourseDayItem[];
}

export interface CourseDayItem {
  order_index: number;
  time_slot?: string;
  title: string;
  description?: string;
  location_name?: string;
  map_url?: string;
}

export interface CourseListParams extends PaginationParams {
  status?: CourseStatus;
  country?: string;
  city?: string;
}

// ==========================================
// Application Types
// ==========================================

export type ApplicationStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'refunded';
export type ApplicationType = 'course' | 'party';

export interface CourseApplicationRequest {
  applicant_name: string;
  phone: string;
  instagram_url?: string;
  age: number;
  gender: Gender;
  introduction?: string;
}

export interface CourseApplication {
  id: string;
  course?: CourseBasic;
  party?: PartyBasic;
  status: ApplicationStatus;
  applied_at: string;
  paid_amount?: number;
  applicant_name?: string;
  phone?: string;
  instagram_url?: string;
  age?: number;
  gender?: Gender;
  introduction?: string;
}

export interface CourseBasic {
  id: string;
  title: string;
  thumbnail_url?: string;
  start_date: string;
  end_date: string;
}

export interface ActiveTravel {
  id: string;
  course: CourseBasic;
  has_new_announcement: boolean;
  expense_balance: number;
}

export interface ApplicationSummary {
  pending: number;
  confirmed: number;
  rejected: number;
  max_participants: number;
}

export interface ApplicationListResponse {
  summary: ApplicationSummary;
  items: CourseApplication[];
}

// ==========================================
// Party Types
// ==========================================

export type PartyStatus = 'draft' | 'recruiting' | 'closed' | 'ongoing' | 'completed' | 'cancelled';

export interface Party {
  id: string;
  influencer_id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  images?: string[];
  region: string;
  venue_name?: string;
  venue_address?: string;
  event_date: string;
  event_time?: string;
  price: number;
  min_participants: number;
  max_participants: number;
  current_participants: number;
  status: PartyStatus;
  recruitment_start: string;
  recruitment_end: string;
  allowed_gender?: AllowedGender;
  min_age?: number;
  max_age?: number;
  influencer?: CourseInfluencer;
  is_applied?: boolean;
  can_apply?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PartyBasic {
  id: string;
  title: string;
  thumbnail_url?: string;
  event_date: string;
}

export interface PartyListParams extends PaginationParams {
  region?: string;
  date_from?: string;
  date_to?: string;
}

// ==========================================
// Announcement Types
// ==========================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  images?: string[];
  is_pinned: boolean;
  created_at: string;
  comment_count: number;
}

export interface AnnouncementCreateRequest {
  title: string;
  content: string;
  images?: string[];
  is_pinned?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

// ==========================================
// Expense Types
// ==========================================

export type ExpenseTransactionType = 'charge' | 'deduct' | 'refund';

export interface ExpenseInfo {
  balance: number;
  total_charged: number;
  total_used: number;
  requested_amount: number;
  transactions: ExpenseTransaction[];
}

export interface ExpenseTransaction {
  id: string;
  type: ExpenseTransactionType;
  amount: number;
  balance_after: number;
  description?: string;
  created_at: string;
}

export interface NbangItemRequest {
  title: string;
  total_amount: number;
  participant_ids: string[];
  include_fee_in_amount?: boolean;
}

export interface NbangItemResponse {
  id: string;
  per_person_amount: number;
  participant_count: number;
  insufficient_balance_users: string[];
}

// ==========================================
// Payment Types
// ==========================================

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentType = 'course' | 'party' | 'expense';

export interface PaymentRequest {
  merchant_uid: string;
  amount: number;
  name: string;
}

export interface PaymentCompleteRequest {
  imp_uid: string;
  merchant_uid: string;
}

export interface Payment {
  id: string;
  user_id: string;
  payment_type: PaymentType;
  amount: number;
  status: PaymentStatus;
  merchant_uid: string;
  imp_uid?: string;
  paid_at?: string;
  created_at: string;
  course?: CourseBasic;
  party?: PartyBasic;
}

export interface PaymentListParams extends PaginationParams {
  status?: PaymentStatus;
  type?: PaymentType;
}

// ==========================================
// Settlement Types
// ==========================================

export type SettlementStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Settlement {
  id: string;
  influencer_id: string;
  reference_type: 'course' | 'party';
  reference_id: string;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  status: SettlementStatus;
  settled_at?: string;
  created_at: string;
  course?: CourseBasic;
  party?: PartyBasic;
}

export interface SettlementListParams extends PaginationParams {
  status?: SettlementStatus;
  from_date?: string;
  to_date?: string;
}

// ==========================================
// Review Types
// ==========================================

export type ReviewType = 'course' | 'party';

export interface Review {
  id: string;
  user_id: string;
  review_type: ReviewType;
  reference_id: string;
  rating: number;
  content: string;
  images?: string[];
  created_at: string;
  updated_at?: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

export interface ReviewCreateRequest {
  review_type: ReviewType;
  reference_id: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface ReviewUpdateRequest {
  rating?: number;
  content?: string;
  images?: string[];
}

// ==========================================
// Message Types
// ==========================================

export interface Conversation {
  id: string;
  other_user: {
    id: string;
    nickname: string;
    avatar_url?: string;
  };
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  related_type?: 'course' | 'party';
  related_id?: string;
}

export interface MessageSendRequest {
  receiver_id: string;
  content: string;
  related_type?: 'course' | 'party';
  related_id?: string;
}

// ==========================================
// Notification Types
// ==========================================

export type NotificationType =
  | 'application_received'
  | 'application_confirmed'
  | 'application_rejected'
  | 'payment_completed'
  | 'refund_completed'
  | 'announcement_posted'
  | 'expense_request'
  | 'message_received'
  | 'review_received';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface NotificationListParams extends PaginationParams {
  unread_only?: boolean;
}

// ==========================================
// Auth Types
// ==========================================

export interface KakaoLoginRequest {
  access_token: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    is_new_user: boolean;
    profile_completed: boolean;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface IdentityVerificationRequest {
  imp_uid: string;
  name: string;
  phone: string;
  birth_date: string;
  gender: Gender;
}

// ==========================================
// Storage Types
// ==========================================

export type StorageFolder = 'avatars' | 'courses' | 'parties' | 'records' | 'reviews';

export interface UploadResponse {
  url: string;
}

// ==========================================
// Admin Types
// ==========================================

export interface InfluencerApplicationAdmin {
  id: string;
  user_id: string;
  display_name: string;
  category: string;
  description: string;
  instagram_url?: string;
  follower_count: number;
  bank_name: string;
  bank_account: string;
  business_number?: string;
  status: VerificationStatus;
  created_at: string;
  user?: User;
}

export interface FeeSettings {
  default_course_fee_rate: number;
  default_party_fee_rate: number;
  pg_fee_rate: number;
}

export interface InfluencerFeeSettings {
  custom_course_fee_rate: number;
  custom_party_fee_rate: number;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  report_type: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter?: User;
  reported_user?: User;
}

export interface ReportResolveRequest {
  action: 'warning' | 'suspend' | 'dismiss';
  resolution: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface Analytics {
  summary: {
    total_users: number;
    new_users: number;
    total_revenue: number;
    total_settlements: number;
  };
  charts: {
    users: ChartData[];
    revenue: ChartData[];
  };
}

export interface ChartData {
  date: string;
  count?: number;
  amount?: number;
}

export interface AnalyticsParams {
  from_date?: string;
  to_date?: string;
  type?: 'daily' | 'weekly' | 'monthly';
}

// ==========================================
// Other Types
// ==========================================

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  order_index: number;
  is_active: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
}

export interface Inquiry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  status: 'pending' | 'answered' | 'closed';
  answer?: string;
  answered_at?: string;
  created_at: string;
}

export interface InquiryCreateRequest {
  title: string;
  content: string;
  category: string;
}

export interface TravelRecord {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  content: string;
  images?: string[];
  visibility: 'public' | 'private' | 'friends';
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
  course?: CourseBasic;
}

export interface TravelRecordCreateRequest {
  course_id: string;
  title: string;
  content: string;
  images?: string[];
  visibility: 'public' | 'private' | 'friends';
}

// ==========================================
// Course Create Types (for Influencer)
// ==========================================

export interface CourseCreateRequest {
  title: string;
  description: string;
  thumbnail_url: string;
  images?: string[];
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  price: number;
  min_participants: number;
  max_participants: number;
  recruitment_start: string;
  recruitment_end: string;
  allowed_gender?: AllowedGender;
  min_age?: number;
  max_age?: number;
  included_items?: CourseItem[];
  optional_items?: OptionalItem[];
  accommodation?: Accommodation;
  refund_policy?: string;
  days?: CourseDay[];
}

export interface PartyCreateRequest {
  title: string;
  description: string;
  thumbnail_url: string;
  images?: string[];
  region: string;
  venue_name: string;
  venue_address?: string;
  event_date: string;
  event_time?: string;
  price: number;
  min_participants: number;
  max_participants: number;
  recruitment_start: string;
  recruitment_end: string;
  allowed_gender?: AllowedGender;
  min_age?: number;
  max_age?: number;
}

// Re-export existing types for backwards compatibility
export * from './auth';
export * from './ui';
export * from './cart';
