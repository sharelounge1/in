// Export all utility modules
export * from './response';
export * from './jwt';
export * from './crypto';

// ========================================
// Common Utility Functions
// ========================================

/**
 * Format currency for Korean Won
 * @param amount - Amount in KRW
 * @returns Formatted string with currency symbol
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

/**
 * Calculate fee amount based on rate
 * @param amount - Total amount
 * @param rate - Fee rate as percentage (e.g., 10 for 10%)
 * @returns Fee amount (floored to integer)
 */
export const calculateFee = (amount: number, rate: number): number => {
  return Math.floor(amount * (rate / 100));
};

/**
 * Calculate net amount after fee deduction
 * @param amount - Gross amount
 * @param rate - Fee rate as percentage
 * @returns Object with gross, fee, and net amounts
 */
export const calculateNetAmount = (
  amount: number,
  rate: number
): { grossAmount: number; feeAmount: number; netAmount: number } => {
  const feeAmount = calculateFee(amount, rate);
  const netAmount = amount - feeAmount;

  return {
    grossAmount: amount,
    feeAmount,
    netAmount,
  };
};

/**
 * Generate unique order ID for payments
 * Format: PREFIX_YYYYMMDDHHMMSS_RANDOM
 * @param prefix - Order type prefix (e.g., 'CRS' for course, 'PTY' for party)
 * @returns Generated order ID
 */
export const generateOrderId = (prefix: string = 'ORD'): string => {
  const now = new Date();
  const dateStr = now
    .toISOString()
    .replace(/[-:T]/g, '')
    .slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}_${dateStr}_${random}`;
};

/**
 * Generate random string for various purposes
 * @param length - Desired string length
 * @returns Random alphanumeric string
 */
export const generateRandomString = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sleep/delay utility for async operations
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry async function with exponential backoff
 * @param fn - Async function to retry
 * @param retries - Maximum number of retries
 * @param delay - Initial delay in ms
 * @returns Result of the function
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

/**
 * Parse Korean date string to Date object
 * @param dateStr - Date string (YYYY-MM-DD or YYYY년 MM월 DD일)
 * @returns Date object
 */
export const parseKoreanDate = (dateStr: string): Date => {
  // Handle Korean format: YYYY년 MM월 DD일
  const koreanMatch = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (koreanMatch) {
    return new Date(
      parseInt(koreanMatch[1]),
      parseInt(koreanMatch[2]) - 1,
      parseInt(koreanMatch[3])
    );
  }

  // Handle standard format: YYYY-MM-DD
  return new Date(dateStr);
};

/**
 * Format date to Korean format
 * @param date - Date object or string
 * @returns Korean formatted date string
 */
export const formatKoreanDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

/**
 * Format date to short format (MM/DD)
 * @param date - Date object or string
 * @returns Short formatted date
 */
export const formatShortDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${month}/${day}`;
};

/**
 * Calculate days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days (inclusive)
 */
export const daysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Inclusive
};

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isPastDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d < today;
};

/**
 * Check if date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Sanitize string for safe storage (basic XSS prevention)
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Truncate string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Mask sensitive data (e.g., phone number, email)
 * @param str - String to mask
 * @param visibleStart - Number of characters visible at start
 * @param visibleEnd - Number of characters visible at end
 * @returns Masked string
 */
export const maskString = (
  str: string,
  visibleStart: number = 3,
  visibleEnd: number = 2
): string => {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskLength = str.length - visibleStart - visibleEnd;

  return start + '*'.repeat(maskLength) + end;
};

/**
 * Mask email address
 * @param email - Email to mask
 * @returns Masked email (e.g., "use***@example.com")
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 3 ? local.slice(0, 3) + '***' : local;

  return `${maskedLocal}@${domain}`;
};

/**
 * Mask phone number
 * @param phone - Phone number to mask
 * @returns Masked phone (e.g., "010-****-5678")
 */
export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(-4)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)}-***-${cleaned.slice(-4)}`;
  }

  return maskString(phone, 3, 4);
};

/**
 * Deep clone object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Omit specified keys from object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without specified keys
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

/**
 * Pick specified keys from object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only specified keys
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Convert snake_case to camelCase
 * @param str - String in snake_case
 * @returns String in camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert camelCase to snake_case
 * @param str - String in camelCase
 * @returns String in snake_case
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Convert object keys from snake_case to camelCase
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 */
export const keysToCamel = <T extends object>(obj: T): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[snakeToCamel(key)] = value;
  }
  return result;
};

/**
 * Convert object keys from camelCase to snake_case
 * @param obj - Object with camelCase keys
 * @returns Object with snake_case keys
 */
export const keysToSnake = <T extends object>(obj: T): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
};
