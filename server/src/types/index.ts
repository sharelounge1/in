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
