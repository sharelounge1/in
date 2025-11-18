import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthUser, UserRole } from '../types';
import { errorResponse } from '../utils/response';

// Error codes
const ErrorCodes = {
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
} as const;

// JWT verification middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, ErrorCodes.AUTH_INVALID_TOKEN, '인증 토큰이 필요합니다', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      errorResponse(res, 'SERVER_ERROR', '서버 설정 오류', 500);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as AuthUser & { sub: string };
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      avatarUrl: decoded.avatarUrl,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errorResponse(res, ErrorCodes.AUTH_TOKEN_EXPIRED, '토큰이 만료되었습니다', 401);
      return;
    }

    errorResponse(res, ErrorCodes.AUTH_INVALID_TOKEN, '유효하지 않은 토큰입니다', 401);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;

      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as AuthUser & { sub: string };
        req.user = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
          avatarUrl: decoded.avatarUrl,
        };
      }
    }

    next();
  } catch {
    // Continue without user for optional auth
    next();
  }
};

// Role-based access control middleware
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '접근 권한이 없습니다', 403);
      return;
    }

    next();
  };
};

// Specific role middlewares for convenience
export const requireInfluencer = requireRole('influencer', 'admin');
export const requireAdmin = requireRole('admin');

// Re-export AuthenticatedRequest for route files
export { AuthenticatedRequest };
