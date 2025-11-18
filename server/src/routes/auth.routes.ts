import { Router, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

/**
 * POST /auth/kakao
 * 카카오 OAuth 로그인
 */
router.post('/kakao', async (req, res: Response) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '카카오 액세스 토큰이 필요합니다', 400);
    }

    // TODO: Implement Kakao OAuth verification
    // 1. Verify Kakao access token
    // 2. Get user info from Kakao
    // 3. Find or create user in database
    // 4. Generate JWT tokens

    // Placeholder response
    successResponse(res, {
      access_token: 'jwt_access_token',
      refresh_token: 'jwt_refresh_token',
      expires_in: 900,
      user: {
        id: 'placeholder-uuid',
        email: 'user@email.com',
        is_new_user: true,
        profile_completed: false,
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '로그인 처리 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /auth/refresh
 * 토큰 갱신
 */
router.post('/refresh', async (req, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '리프레시 토큰이 필요합니다', 400);
    }

    // TODO: Implement token refresh logic
    // 1. Verify refresh token
    // 2. Generate new access token

    // Placeholder response
    successResponse(res, {
      access_token: 'new_jwt_access_token',
      expires_in: 900,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '토큰 갱신 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /auth/identity-verification
 * 본인인증 완료 처리
 */
router.post('/identity-verification', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imp_uid, name, phone, birth_date, gender } = req.body;

    if (!imp_uid || !name || !phone || !birth_date || !gender) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보가 누락되었습니다', 400);
    }

    // TODO: Implement identity verification
    // 1. Verify imp_uid with Iamport API
    // 2. Update user's verified status in database
    // 3. Store verification info

    successResponse(res, {
      verified: true,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '본인인증 처리 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /auth/logout
 * 로그아웃 (토큰 무효화)
 */
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Implement logout logic
    // 1. Invalidate refresh token in database
    // 2. Add access token to blacklist (if using blacklist approach)

    successResponse(res, null, '로그아웃 되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '로그아웃 처리 중 오류가 발생했습니다', 500);
  }
});

export default router;
