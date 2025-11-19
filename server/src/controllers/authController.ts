import { Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, '리프레시 토큰이 필요합니다'),
});

const identityVerificationSchema = z.object({
  imp_uid: z.string().min(1, '인증 UID가 필요합니다'),
  name: z.string().min(1, '이름이 필요합니다'),
  phone: z.string().min(1, '전화번호가 필요합니다'),
  birth_date: z.string().min(1, '생년월일이 필요합니다'),
  gender: z.string().min(1, '성별이 필요합니다'),
});

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

class AuthController {
  /**
   * POST /auth/register
   * Register a new user
   */
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const { email, password, name, phone } = validation.data;

      const result = await authService.register({
        email,
        password,
        name,
        phone,
      });

      successResponse(res, {
        access_token: result.tokens.accessToken,
        refresh_token: result.tokens.refreshToken,
        expires_in: result.tokens.expiresIn,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          is_new_user: true,
          profile_completed: false,
        },
      }, '회원가입이 완료되었습니다', 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'EMAIL_ALREADY_EXISTS') {
          errorResponse(res, ErrorCodes.EMAIL_ALREADY_EXISTS, '이미 사용중인 이메일입니다', 409);
          return;
        }
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '회원가입 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /auth/login
   * Login user
   */
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = loginSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const { email, password } = validation.data;

      const result = await authService.login({ email, password });

      successResponse(res, {
        access_token: result.tokens.accessToken,
        refresh_token: result.tokens.refreshToken,
        expires_in: result.tokens.expiresIn,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          nickname: result.user.nickname,
          avatar_url: result.user.avatarUrl,
          role: result.user.role,
          is_new_user: false,
          profile_completed: !!result.user.nickname,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'INVALID_CREDENTIALS':
            errorResponse(res, ErrorCodes.INVALID_CREDENTIALS, '이메일 또는 비밀번호가 올바르지 않습니다', 401);
            return;
          case 'ACCOUNT_SUSPENDED':
            errorResponse(res, ErrorCodes.ACCOUNT_SUSPENDED, '정지된 계정입니다', 403);
            return;
          case 'ACCOUNT_DELETED':
            errorResponse(res, ErrorCodes.ACCOUNT_DELETED, '탈퇴한 계정입니다', 403);
            return;
        }
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '로그인 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = refreshSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const { refresh_token } = validation.data;

      const result = await authService.refreshToken(refresh_token);

      successResponse(res, {
        access_token: result.accessToken,
        expires_in: result.expiresIn,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'INVALID_REFRESH_TOKEN':
          case 'INVALID_TOKEN_TYPE':
            errorResponse(res, ErrorCodes.INVALID_REFRESH_TOKEN, '유효하지 않은 리프레시 토큰입니다', 401);
            return;
          case 'REFRESH_TOKEN_EXPIRED':
            errorResponse(res, ErrorCodes.REFRESH_TOKEN_EXPIRED, '리프레시 토큰이 만료되었습니다', 401);
            return;
        }
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '토큰 갱신 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /auth/logout
   * Logout user
   */
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;

      await authService.logout(req.user.id, refresh_token);

      successResponse(res, null, '로그아웃 되었습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '로그아웃 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /auth/identity-verification
   * Verify user identity via phone
   */
  async verifyIdentity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = identityVerificationSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const { imp_uid, name, phone, birth_date, gender } = validation.data;

      await authService.verifyIdentity(
        req.user.id,
        imp_uid,
        name,
        phone,
        birth_date,
        gender
      );

      successResponse(res, {
        verified: true,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'VERIFICATION_FAILED') {
        errorResponse(res, 'VERIFICATION_FAILED', '본인인증에 실패했습니다', 400);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '본인인증 처리 중 오류가 발생했습니다', 500);
    }
  }
}

export const authController = new AuthController();
export default authController;
