import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse, paginatedResponse, parsePagination } from '../utils/response';
import { courseService, CourseApplyData } from '../services/courseService';

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
} as const;

/**
 * Course Controller
 * Handles all course-related HTTP requests
 */
export const courseController = {
  /**
   * GET /courses
   * Get paginated list of courses with filters
   */
  async getList(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, country, city, start_date_from, start_date_to } = req.query;
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });

      const result = await courseService.getList({
        status: status as string | undefined,
        country: country as string | undefined,
        city: city as string | undefined,
        startDateFrom: start_date_from as string | undefined,
        startDateTo: start_date_to as string | undefined,
        page,
        limit,
      });

      paginatedResponse(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : '코스 목록 조회 중 오류가 발생했습니다';
      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * GET /courses/featured
   * Get featured courses for homepage
   */
  async getFeatured(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const courses = await courseService.getFeatured(limit);

      successResponse(res, {
        items: courses,
        total: courses.length,
        page: 1,
        limit,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '추천 코스 조회 중 오류가 발생했습니다';
      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * GET /courses/:id
   * Get detailed course information
   */
  async getDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const course = await courseService.getDetail(id, userId);

      if (!course) {
        errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
        return;
      }

      // Increment view count (fire and forget)
      courseService.incrementViewCount(id).catch(() => {
        // Silently ignore view count errors
      });

      successResponse(res, course);
    } catch (error) {
      const message = error instanceof Error ? error.message : '코스 상세 조회 중 오류가 발생했습니다';
      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * POST /courses/:id/apply
   * Apply to a course
   */
  async apply(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const { applicant_name, phone, instagram_url, age, gender, introduction, selected_options } = req.body;

      // Validate required fields
      if (!applicant_name || !phone || !age || !gender) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
        return;
      }

      // Validate phone format (Korean phone number)
      const phoneRegex = /^01[0-9]{8,9}$/;
      if (!phoneRegex.test(phone.replace(/-/g, ''))) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 전화번호 형식이 아닙니다', 400);
        return;
      }

      // Validate age
      if (typeof age !== 'number' || age < 1 || age > 150) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 나이를 입력해주세요', 400);
        return;
      }

      // Validate gender
      if (!['male', 'female', 'other'].includes(gender)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 성별을 선택해주세요', 400);
        return;
      }

      const applyData: CourseApplyData = {
        applicant_name,
        phone: phone.replace(/-/g, ''),
        instagram_url: instagram_url || '',
        age,
        gender,
        introduction: introduction || '',
        selected_options,
      };

      const result = await courseService.apply(id, userId, applyData);

      successResponse(res, result, '코스 신청이 완료되었습니다');
    } catch (error) {
      const message = error instanceof Error ? error.message : '코스 신청 중 오류가 발생했습니다';

      // Handle specific error cases
      if (message.includes('이미 신청')) {
        errorResponse(res, ErrorCodes.ALREADY_EXISTS, message, 409);
        return;
      }
      if (message.includes('찾을 수 없습니다')) {
        errorResponse(res, ErrorCodes.NOT_FOUND, message, 404);
        return;
      }
      if (message.includes('조건') || message.includes('모집') || message.includes('마감')) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, message, 400);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * DELETE /courses/:id/applications/:applicationId
   * Cancel a course application
   */
  async cancelApplication(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const result = await courseService.cancelApplication(applicationId, userId);

      successResponse(res, result, '신청이 취소되었습니다');
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 취소 중 오류가 발생했습니다';

      if (message.includes('찾을 수 없습니다')) {
        errorResponse(res, ErrorCodes.NOT_FOUND, message, 404);
        return;
      }
      if (message.includes('본인') || message.includes('권한')) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, message, 403);
        return;
      }
      if (message.includes('이미') || message.includes('취소')) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, message, 400);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * GET /courses/:id/applications
   * Get all applications for a course (influencer only)
   */
  async getApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const result = await courseService.getApplications(id, userId);

      successResponse(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : '신청 목록 조회 중 오류가 발생했습니다';

      if (message.includes('찾을 수 없습니다')) {
        errorResponse(res, ErrorCodes.NOT_FOUND, message, 404);
        return;
      }
      if (message.includes('본인')) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, message, 403);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },
};

export default courseController;
