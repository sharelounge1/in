import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Salt rounds for bcrypt
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a UUID v4
 * @returns UUID string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Generate a secure verification code (6 digits)
 * @returns 6-digit verification code string
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a secure token (URL-safe)
 * @param length - Length of the token (default 32)
 * @returns URL-safe token string
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate invitation code for courses/parties
 * @param prefix - Code prefix (default: 'INV')
 * @returns Invitation code
 */
export const generateInvitationCode = (prefix: string = 'INV'): string => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
};
