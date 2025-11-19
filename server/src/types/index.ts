import { Request } from 'express';

// User roles
export type UserRole = 'user' | 'influencer' | 'admin';

// Authenticated user attached to request
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatarUrl?: string;
}

// Extended Express Request with user
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Common entity types
export interface Course {
  id: string;
  influencerId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  status: CourseStatus;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CourseStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';

export interface Participant {
  id: string;
  userId: string;
  courseId: string;
  status: ParticipantStatus;
  paidAmount: number;
  appliedAt: string;
  paidAt?: string;
}

export type ParticipantStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: PaymentStatus;
  pgTransactionId?: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partial_refund';

export interface Settlement {
  id: string;
  influencerId: string;
  courseId: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: SettlementStatus;
  settledAt?: string;
  createdAt: string;
}

export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed';

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// JWT payload
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Inquiry types
export interface Inquiry {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  answeredAt?: string;
}

export type InquiryStatus = 'pending' | 'answered' | 'closed';

// Announcement types
export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Profile types
export interface Profile {
  id: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  name?: string;
  nickname?: string;
  avatarUrl?: string;
  instagramUrl?: string;
  gender?: string;
  birthDate?: string;
  bio?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'deleted';
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

// Auth types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

// User profile update types
export interface UpdateProfileRequest {
  nickname?: string;
  avatarUrl?: string;
  instagramUrl?: string;
  bio?: string;
  gender?: string;
  birthDate?: string;
}

// Application types
export interface CourseApplication {
  id: string;
  courseId: string;
  userId: string;
  applicantName: string;
  phone: string;
  instagramUrl: string;
  age?: number;
  gender?: string;
  introduction?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  statusReason?: string;
  paymentId?: string;
  paidAmount?: number;
  appliedAt: string;
  confirmedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Active travel types
export interface ActiveTravel {
  id: string;
  course: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    startDate: string;
    endDate: string;
  };
  hasNewAnnouncement: boolean;
  expenseBalance: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  sentPush: boolean;
  sentEmail: boolean;
  sentSms: boolean;
  createdAt: string;
}

// Refresh token storage
export interface RefreshTokenRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
