import jwt, { SignOptions, JwtPayload as JwtPayloadBase } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types';

// JWT payload structure
export interface TokenPayload extends JwtPayloadBase {
  sub: string; // User ID
  email: string;
  role: UserRole;
  name?: string;
  avatarUrl?: string;
}

// User data for token generation
export interface TokenUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatarUrl?: string;
}

// Token pair response
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Generate access token (short-lived, 15 minutes)
 * @param user - User data to encode in token
 * @returns JWT access token
 */
export const generateAccessToken = (user: TokenUser): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };

  const options: SignOptions = {
    expiresIn: '15m',
    issuer: 'influencer-travel-platform',
    audience: 'influencer-travel-users',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Generate refresh token (long-lived, 7 days)
 * @param user - User data to encode in token
 * @returns JWT refresh token
 */
export const generateRefreshToken = (user: TokenUser): string => {
  const payload = {
    sub: user.id,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: '7d',
    issuer: 'influencer-travel-platform',
    audience: 'influencer-travel-users',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Generate both access and refresh tokens
 * @param user - User data to encode in tokens
 * @returns Token pair with expiration info
 */
export const generateTokenPair = (user: TokenUser): TokenPair => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'influencer-travel-platform',
      audience: 'influencer-travel-users',
    }) as TokenPayload;

    return decoded;
  } catch {
    return null;
  }
};

/**
 * Verify refresh token specifically
 * @param token - Refresh token to verify
 * @returns User ID if valid, null otherwise
 */
export const verifyRefreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'influencer-travel-platform',
      audience: 'influencer-travel-users',
    }) as { sub: string; type: string };

    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded.sub;
  } catch {
    return null;
  }
};

/**
 * Decode token without verification (useful for getting payload from expired tokens)
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Get remaining time until token expires
 * @param token - JWT token
 * @returns Remaining seconds until expiration, or 0 if expired
 */
export const getTokenExpiration = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return 0;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = decoded.exp - now;

  return remaining > 0 ? remaining : 0;
};

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  return getTokenExpiration(token) === 0;
};

/**
 * Extract user ID from token (with verification)
 * @param token - JWT token
 * @returns User ID or null
 */
export const getUserIdFromToken = (token: string): string | null => {
  const decoded = verifyToken(token);
  return decoded?.sub ?? null;
};

/**
 * Generate a password reset token (1 hour expiry)
 * @param userId - User ID
 * @param email - User email
 * @returns Password reset token
 */
export const generatePasswordResetToken = (userId: string, email: string): string => {
  const payload = {
    sub: userId,
    email,
    type: 'password_reset',
  };

  const options: SignOptions = {
    expiresIn: '1h',
    issuer: 'influencer-travel-platform',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Verify password reset token
 * @param token - Password reset token
 * @returns Object with userId and email if valid, null otherwise
 */
export const verifyPasswordResetToken = (
  token: string
): { userId: string; email: string } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'influencer-travel-platform',
    }) as { sub: string; email: string; type: string };

    if (decoded.type !== 'password_reset') {
      return null;
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};

/**
 * Generate email verification token (24 hours expiry)
 * @param userId - User ID
 * @param email - User email
 * @returns Email verification token
 */
export const generateEmailVerificationToken = (userId: string, email: string): string => {
  const payload = {
    sub: userId,
    email,
    type: 'email_verification',
  };

  const options: SignOptions = {
    expiresIn: '24h',
    issuer: 'influencer-travel-platform',
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Verify email verification token
 * @param token - Email verification token
 * @returns Object with userId and email if valid, null otherwise
 */
export const verifyEmailVerificationToken = (
  token: string
): { userId: string; email: string } | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'influencer-travel-platform',
    }) as { sub: string; email: string; type: string };

    if (decoded.type !== 'email_verification') {
      return null;
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};
