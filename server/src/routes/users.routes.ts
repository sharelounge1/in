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
 * POST /users/terms-agreement
 * 이용약관 동의 저장
 */
router.post('/terms-agreement', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { service_terms, privacy_policy, third_party_sharing, marketing } = req.body;

    if (service_terms !== true || privacy_policy !== true || third_party_sharing !== true) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 약관에 동의해주세요', 400);
    }

    // TODO: Save terms agreement to database
    // await userService.saveTermsAgreement(req.user.id, {
    //   service_terms,
    //   privacy_policy,
    //   third_party_sharing,
    //   marketing,
    // });

    successResponse(res, null, '약관 동의가 저장되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '약관 동의 저장 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /users/check-nickname
 * 닉네임 중복 확인
 */
router.get('/check-nickname', async (req, res: Response) => {
  try {
    const { nickname } = req.query;

    if (!nickname || typeof nickname !== 'string') {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '닉네임을 입력해주세요', 400);
    }

    // TODO: Check nickname availability in database
    // const isAvailable = await userService.checkNicknameAvailable(nickname);

    const isAvailable = true; // Placeholder

    successResponse(res, {
      available: isAvailable,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '닉네임 확인 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /users/profile
 * 초기 프로필 설정
 */
router.post('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { nickname, avatar_url, birth_date, gender } = req.body;

    if (!nickname) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '닉네임을 입력해주세요', 400);
    }

    // TODO: Save profile to database
    // const profile = await userService.createProfile(req.user.id, {
    //   nickname,
    //   avatar_url,
    //   birth_date,
    //   gender,
    // });

    successResponse(res, null, '프로필이 저장되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 저장 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /users/me
 * 내 프로필 조회
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Get user profile from database
    // const user = await userService.getProfile(req.user.id);

    // Placeholder response
    successResponse(res, {
      id: req.user.id,
      email: req.user.email,
      nickname: req.user.name || '',
      avatar_url: req.user.avatarUrl || '',
      phone: '',
      instagram_url: '',
      birth_date: '',
      gender: '',
      role: req.user.role,
      notification_settings: {
        push: true,
        email: true,
        sms: false,
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /users/me
 * 프로필 정보 수정
 */
router.put('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { nickname, avatar_url, instagram_url } = req.body;

    // TODO: Update profile in database
    // const updated = await userService.updateProfile(req.user.id, {
    //   nickname,
    //   avatar_url,
    //   instagram_url,
    // });

    successResponse(res, null, '프로필이 수정되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 수정 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /users/me/notifications
 * 알림 수신 설정 변경
 */
router.put('/me/notifications', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { push, email, sms } = req.body;

    // TODO: Update notification settings in database
    // await userService.updateNotificationSettings(req.user.id, {
    //   push,
    //   email,
    //   sms,
    // });

    successResponse(res, null, '알림 설정이 변경되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '알림 설정 변경 중 오류가 발생했습니다', 500);
  }
});

/**
 * DELETE /users/me
 * 회원 탈퇴
 */
router.delete('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason, feedback } = req.body;

    // TODO: Process account deletion
    // 1. Check for active bookings/payments
    // 2. Save withdrawal reason
    // 3. Soft delete or anonymize user data
    // await userService.deleteAccount(req.user.id, { reason, feedback });

    successResponse(res, null, '회원 탈퇴가 완료되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '회원 탈퇴 처리 중 오류가 발생했습니다', 500);
  }
});

export default router;
