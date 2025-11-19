import { Router, Response, Request } from 'express';
import { authController } from '../controllers/authController';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
  authController.register(req as AuthenticatedRequest, res);
});

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', (req, res) => {
  authController.login(req as AuthenticatedRequest, res);
});

/**
 * POST /auth/kakao
 * Kakao OAuth login
 */
router.post('/kakao', async (req: Request, res: Response) => {
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
 * Refresh access token
 */
router.post('/refresh', (req, res) => {
  authController.refresh(req as AuthenticatedRequest, res);
});

/**
 * POST /auth/identity-verification
 * Identity verification via phone
 */
router.post('/identity-verification', authenticate, (req, res) => {
  authController.verifyIdentity(req as AuthenticatedRequest, res);
});

/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', authenticate, (req, res) => {
  authController.logout(req as AuthenticatedRequest, res);
});

export default router;
