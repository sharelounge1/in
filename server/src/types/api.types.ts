// API Response Types
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Error Codes
export const ErrorCodes = {
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// User Types
export type UserRole = 'user' | 'influencer' | 'admin';
export type Gender = 'male' | 'female' | 'other';
export type ApplicationStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';
export type CourseStatus = 'draft' | 'recruiting' | 'closed' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial_refund' | 'failed';
export type SettlementStatus = 'pending' | 'approved' | 'completed';

export interface User {
  id: string;
  email: string;
  nickname?: string;
  avatar_url?: string;
  phone?: string;
  instagram_url?: string;
  birth_date?: string;
  gender?: Gender;
  role: UserRole;
  notification_settings?: NotificationSettings;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface AuthenticatedRequest {
  user?: User;
}

// Course Types
export interface CourseListItem {
  id: string;
  title: string;
  thumbnail_url: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  price: number;
  max_participants: number;
  current_participants: number;
  status: CourseStatus;
  influencer: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

// Payment Types
export interface PaymentRequest {
  merchant_uid: string;
  amount: number;
  name: string;
}

// Helper function to create success response
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to create error response
export function createErrorResponse(code: string, message: string): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };
}
