import { Response } from 'express';
import { z } from 'zod';
import { userService } from '../services/userService';
import { successResponse, errorResponse, parsePagination, paginatedResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// Validation schemas
const updateProfileSchema = z.object({
  nickname: z.string().min(2, '닉네임은 최소 2자 이상이어야 합니다').max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
  instagram_url: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  gender: z.enum(['male', 'female', 'other']).optional().nullable(),
  birth_date: z.string().optional().nullable(),
});

const notificationSettingsSchema = z.object({
  push: z.boolean().optional(),
  email: z.boolean().optional(),
  sms: z.boolean().optional(),
});

const termsAgreementSchema = z.object({
  service_terms: z.boolean(),
  privacy_policy: z.boolean(),
  third_party_sharing: z.boolean(),
  marketing: z.boolean().optional().default(false),
});

const deleteAccountSchema = z.object({
  reason: z.string().optional(),
  feedback: z.string().optional(),
});

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NICKNAME_ALREADY_EXISTS: 'NICKNAME_ALREADY_EXISTS',
  ACTIVE_APPLICATIONS_EXIST: 'ACTIVE_APPLICATIONS_EXIST',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

class UserController {
  /**
   * GET /users/me
   * Get current user profile
   */
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await userService.getProfile(req.user.id);

      successResponse(res, {
        id: profile.id,
        email: profile.email,
        nickname: profile.nickname,
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        phone_verified: profile.phoneVerified,
        instagram_url: profile.instagramUrl,
        name: profile.name,
        birth_date: profile.birthDate,
        gender: profile.gender,
        bio: profile.bio,
        role: profile.role,
        status: profile.status,
        notification_settings: profile.notificationSettings,
        created_at: profile.createdAt,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '사용자를 찾을 수 없습니다', 404);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 조회 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * PUT /users/me
   * Update current user profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = updateProfileSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const data = validation.data;

      const profile = await userService.updateProfile(req.user.id, {
        nickname: data.nickname,
        avatarUrl: data.avatar_url || undefined,
        instagramUrl: data.instagram_url || undefined,
        bio: data.bio || undefined,
        gender: data.gender || undefined,
        birthDate: data.birth_date || undefined,
      });

      successResponse(res, {
        id: profile.id,
        email: profile.email,
        nickname: profile.nickname,
        avatar_url: profile.avatarUrl,
        instagram_url: profile.instagramUrl,
        bio: profile.bio,
        gender: profile.gender,
        birth_date: profile.birthDate,
      }, '프로필이 수정되었습니다');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'NICKNAME_ALREADY_EXISTS') {
          errorResponse(res, ErrorCodes.NICKNAME_ALREADY_EXISTS, '이미 사용중인 닉네임입니다', 409);
          return;
        }
        if (error.message === 'USER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '사용자를 찾을 수 없습니다', 404);
          return;
        }
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 수정 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * GET /users/check-nickname
   * Check if nickname is available
   */
  async checkNickname(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { nickname } = req.query;

      if (!nickname || typeof nickname !== 'string') {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '닉네임을 입력해주세요', 400);
        return;
      }

      if (nickname.length < 2 || nickname.length > 50) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '닉네임은 2-50자 사이여야 합니다', 400);
        return;
      }

      const available = await userService.checkNicknameAvailable(nickname);

      successResponse(res, {
        available,
      });
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '닉네임 확인 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * PUT /users/me/notifications
   * Update notification settings
   */
  async updateNotificationSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = notificationSettingsSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const settings = await userService.updateNotificationSettings(
        req.user.id,
        validation.data
      );

      successResponse(res, settings, '알림 설정이 변경되었습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '알림 설정 변경 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /users/terms-agreement
   * Save terms agreement
   */
  async saveTermsAgreement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = termsAgreementSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const data = validation.data;

      if (!data.service_terms || !data.privacy_policy || !data.third_party_sharing) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 약관에 동의해주세요', 400);
        return;
      }

      await userService.saveTermsAgreement(req.user.id, {
        serviceTerms: data.service_terms,
        privacyPolicy: data.privacy_policy,
        thirdPartySharing: data.third_party_sharing,
        marketing: data.marketing || false,
      });

      successResponse(res, null, '약관 동의가 저장되었습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '약관 동의 저장 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * GET /users/me/applications
   * Get user's course/party applications
   */
  async getApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type } = req.query;
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });

      const applicationType = type === 'party' ? 'party' : 'course';

      const result = await userService.getApplications(
        req.user.id,
        applicationType,
        page,
        limit
      );

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '신청 목록 조회 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * GET /users/me/travels
   * Get user's active travels
   */
  async getActiveTravels(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const travels = await userService.getActiveTravels(req.user.id);

      successResponse(res, {
        items: travels.map(travel => ({
          id: travel.id,
          course: {
            id: travel.course.id,
            title: travel.course.title,
            thumbnail_url: travel.course.thumbnailUrl,
            start_date: travel.course.startDate,
            end_date: travel.course.endDate,
          },
          has_new_announcement: travel.hasNewAnnouncement,
          expense_balance: travel.expenseBalance,
        })),
      });
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '여행 목록 조회 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * GET /users/me/notifications
   * Get user's notifications
   */
  async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });

      const result = await userService.getNotifications(req.user.id, page, limit);

      const mappedItems = result.items.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        is_read: n.isRead,
        read_at: n.readAt,
        created_at: n.createdAt,
      }));

      paginatedResponse(res, mappedItems, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '알림 조회 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * PUT /users/notifications/:id/read
   * Mark notification as read
   */
  async markNotificationRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await userService.markNotificationRead(id, req.user.id);

      successResponse(res, null, '알림을 읽음 처리했습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '알림 읽음 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * PUT /users/notifications/read-all
   * Mark all notifications as read
   */
  async markAllNotificationsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await userService.markAllNotificationsRead(req.user.id);

      successResponse(res, null, '모든 알림을 읽음 처리했습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '알림 읽음 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * DELETE /users/me
   * Delete user account
   */
  async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = deleteAccountSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      const { reason, feedback } = validation.data;

      await userService.deleteAccount(req.user.id, reason, feedback);

      successResponse(res, null, '회원 탈퇴가 완료되었습니다');
    } catch (error) {
      if (error instanceof Error && error.message === 'ACTIVE_APPLICATIONS_EXIST') {
        errorResponse(
          res,
          ErrorCodes.ACTIVE_APPLICATIONS_EXIST,
          '진행 중인 신청이 있어 탈퇴할 수 없습니다',
          400
        );
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '회원 탈퇴 처리 중 오류가 발생했습니다', 500);
    }
  }

  /**
   * POST /users/profile
   * Create initial profile
   */
  async createProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = updateProfileSchema.safeParse(req.body);

      if (!validation.success) {
        errorResponse(
          res,
          ErrorCodes.VALIDATION_ERROR,
          validation.error.errors[0].message,
          400
        );
        return;
      }

      if (!validation.data.nickname) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '닉네임을 입력해주세요', 400);
        return;
      }

      const data = validation.data;

      const profile = await userService.updateProfile(req.user.id, {
        nickname: data.nickname,
        avatarUrl: data.avatar_url || undefined,
        gender: data.gender || undefined,
        birthDate: data.birth_date || undefined,
      });

      successResponse(res, {
        id: profile.id,
        email: profile.email,
        nickname: profile.nickname,
        avatar_url: profile.avatarUrl,
        gender: profile.gender,
        birth_date: profile.birthDate,
      }, '프로필이 저장되었습니다', 201);
    } catch (error) {
      if (error instanceof Error && error.message === 'NICKNAME_ALREADY_EXISTS') {
        errorResponse(res, ErrorCodes.NICKNAME_ALREADY_EXISTS, '이미 사용중인 닉네임입니다', 409);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, '프로필 저장 중 오류가 발생했습니다', 500);
    }
  }
}

export const userController = new UserController();
export default userController;
