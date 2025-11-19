// Export all configuration modules

export { env, type Env } from './env';
export {
  supabaseAdmin,
  createUserClient,
  getUserFromToken
} from './supabase';

// Error codes for consistent error handling across the application
export const ErrorCodes = {
  // Authentication errors (AUTH_XXX)
  AUTH_001: 'AUTH_001', // Invalid credentials
  AUTH_002: 'AUTH_002', // Token expired
  AUTH_003: 'AUTH_003', // Invalid token
  AUTH_004: 'AUTH_004', // Unauthorized
  AUTH_005: 'AUTH_005', // Forbidden
  AUTH_006: 'AUTH_006', // Account suspended
  AUTH_007: 'AUTH_007', // Email not verified

  // User errors (USER_XXX)
  USER_001: 'USER_001', // User not found
  USER_002: 'USER_002', // Email already exists
  USER_003: 'USER_003', // Invalid phone format
  USER_004: 'USER_004', // Profile update failed
  USER_005: 'USER_005', // Invalid user data

  // Course errors (COURSE_XXX)
  COURSE_001: 'COURSE_001', // Course not found
  COURSE_002: 'COURSE_002', // Course full
  COURSE_003: 'COURSE_003', // Registration closed
  COURSE_004: 'COURSE_004', // Already applied
  COURSE_005: 'COURSE_005', // Cannot modify course
  COURSE_006: 'COURSE_006', // Invalid course data
  COURSE_007: 'COURSE_007', // Course cancelled

  // Party errors (PARTY_XXX)
  PARTY_001: 'PARTY_001', // Party not found
  PARTY_002: 'PARTY_002', // Party full
  PARTY_003: 'PARTY_003', // Registration closed
  PARTY_004: 'PARTY_004', // Already applied
  PARTY_005: 'PARTY_005', // Cannot modify party

  // Payment errors (PAYMENT_XXX)
  PAYMENT_001: 'PAYMENT_001', // Payment failed
  PAYMENT_002: 'PAYMENT_002', // Invalid payment amount
  PAYMENT_003: 'PAYMENT_003', // Payment not found
  PAYMENT_004: 'PAYMENT_004', // Refund failed
  PAYMENT_005: 'PAYMENT_005', // Already paid
  PAYMENT_006: 'PAYMENT_006', // Payment pending

  // Settlement errors (SETTLEMENT_XXX)
  SETTLEMENT_001: 'SETTLEMENT_001', // Settlement not found
  SETTLEMENT_002: 'SETTLEMENT_002', // Invalid bank info
  SETTLEMENT_003: 'SETTLEMENT_003', // Settlement processing
  SETTLEMENT_004: 'SETTLEMENT_004', // Settlement failed

  // Influencer errors (INFLUENCER_XXX)
  INFLUENCER_001: 'INFLUENCER_001', // Not an influencer
  INFLUENCER_002: 'INFLUENCER_002', // Verification pending
  INFLUENCER_003: 'INFLUENCER_003', // Influencer not found

  // File errors (FILE_XXX)
  FILE_001: 'FILE_001', // File too large
  FILE_002: 'FILE_002', // Invalid file type
  FILE_003: 'FILE_003', // Upload failed

  // Validation errors (VALIDATION_XXX)
  VALIDATION_001: 'VALIDATION_001', // Invalid input
  VALIDATION_002: 'VALIDATION_002', // Missing required field
  VALIDATION_003: 'VALIDATION_003', // Invalid format

  // Server errors (SERVER_XXX)
  SERVER_001: 'SERVER_001', // Internal error
  SERVER_002: 'SERVER_002', // Database error
  SERVER_003: 'SERVER_003', // External service error
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

// Application constants
export const Constants = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOC_TYPES: ['application/pdf'],

  // Token expiration
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',

  // Fee rates (defaults)
  DEFAULT_COURSE_FEE_RATE: 10,
  DEFAULT_PARTY_FEE_RATE: 10,
  PG_FEE_RATE: 3.3,

  // Minimum amounts
  MIN_EXPENSE_CHARGE: 50000,
} as const;
