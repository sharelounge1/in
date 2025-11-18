import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { supabaseAdmin } from '../config/supabase';
import { AuthenticatedRequest, UserRole, JwtPayload, AuthUser } from '../types';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

// Extract token from Authorization header
const extractToken = (authHeader?: string): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

// Main authentication middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Get user from Supabase to ensure they still exist and are active
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, name, avatar_url')
      .eq('id', decoded.sub)
      .single();

    if (error || !userData) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role as UserRole,
      name: userData.name,
      avatarUrl: userData.avatar_url,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

// Role-based access control middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      next();
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Get user from Supabase
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, name, avatar_url')
      .eq('id', decoded.sub)
      .single();

    if (!error && userData) {
      req.user = {
        id: userData.id,
        email: userData.email,
        role: userData.role as UserRole,
        name: userData.name,
        avatarUrl: userData.avatar_url,
      };
    }

    next();
  } catch {
    // Silently fail for optional auth
    next();
  }
};

// Check if user owns the resource
export const checkOwnership = (
  getResourceUserId: (req: AuthenticatedRequest) => Promise<string | null>
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        next();
        return;
      }

      const resourceUserId = await getResourceUserId(req);

      if (!resourceUserId) {
        next(new ForbiddenError('Resource not found'));
        return;
      }

      if (resourceUserId !== req.user.id) {
        throw new ForbiddenError('Access denied');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Utility to generate JWT token
export const generateToken = (user: AuthUser): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// Utility to verify and decode token
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
