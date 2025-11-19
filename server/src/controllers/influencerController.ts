import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse, createdResponse, paginatedResponse, parsePagination } from '../utils/response';
import { influencerService } from '../services/influencerService';

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

// Influencer Controller
export const influencerController = {
  /**
   * GET /influencer/dashboard
   * Get influencer dashboard statistics
   */
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await influencerService.getDashboard(req.user.id);

      successResponse(res, {
        total_courses: stats.totalCourses,
        active_courses: stats.activeCourses,
        total_participants: stats.totalParticipants,
        total_revenue: stats.totalRevenue,
        pending_settlements: stats.pendingSettlements,
        completed_settlements: stats.completedSettlements,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '대시보드 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /influencer/courses
   * Get influencer's courses
   */
  async getCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit, offset } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, from_date, to_date } = req.query;

      const result = await influencerService.getCourses(req.user.id, {
        page,
        limit,
        status: status as string,
        fromDate: from_date as string,
        toDate: to_date as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * POST /influencer/courses
   * Create a new course
   */
  async createCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        thumbnail_url,
        images,
        country,
        city,
        start_date,
        end_date,
        total_days,
        recruitment_start,
        recruitment_end,
        min_participants,
        max_participants,
        allowed_gender,
        min_age,
        max_age,
        requirements,
        price,
        price_includes,
        price_excludes,
        included_items,
        optional_items,
        accommodation,
        refund_policy,
        status,
        visibility,
      } = req.body;

      // Validation
      if (!title || !country || !city || !start_date || !end_date || !recruitment_start || !recruitment_end || !max_participants || !price) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
        return;
      }

      const result = await influencerService.createCourse(req.user.id, {
        title,
        description,
        thumbnailUrl: thumbnail_url,
        images,
        country,
        city,
        startDate: start_date,
        endDate: end_date,
        totalDays: total_days,
        recruitmentStart: recruitment_start,
        recruitmentEnd: recruitment_end,
        minParticipants: min_participants,
        maxParticipants: max_participants,
        allowedGender: allowed_gender,
        minAge: min_age,
        maxAge: max_age,
        requirements,
        price,
        priceIncludes: price_includes,
        priceExcludes: price_excludes,
        includedItems: included_items,
        optionalItems: optional_items,
        accommodation,
        refundPolicy: refund_policy,
        status,
        visibility,
      });

      createdResponse(res, { id: result.id }, '코스가 등록되었습니다');
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 등록 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /influencer/courses/:id
   * Update an existing course
   */
  async updateCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Transform snake_case to camelCase for service
      const transformedData: Record<string, unknown> = {};

      if (updateData.title !== undefined) transformedData.title = updateData.title;
      if (updateData.description !== undefined) transformedData.description = updateData.description;
      if (updateData.thumbnail_url !== undefined) transformedData.thumbnailUrl = updateData.thumbnail_url;
      if (updateData.images !== undefined) transformedData.images = updateData.images;
      if (updateData.country !== undefined) transformedData.country = updateData.country;
      if (updateData.city !== undefined) transformedData.city = updateData.city;
      if (updateData.start_date !== undefined) transformedData.startDate = updateData.start_date;
      if (updateData.end_date !== undefined) transformedData.endDate = updateData.end_date;
      if (updateData.total_days !== undefined) transformedData.totalDays = updateData.total_days;
      if (updateData.recruitment_start !== undefined) transformedData.recruitmentStart = updateData.recruitment_start;
      if (updateData.recruitment_end !== undefined) transformedData.recruitmentEnd = updateData.recruitment_end;
      if (updateData.min_participants !== undefined) transformedData.minParticipants = updateData.min_participants;
      if (updateData.max_participants !== undefined) transformedData.maxParticipants = updateData.max_participants;
      if (updateData.allowed_gender !== undefined) transformedData.allowedGender = updateData.allowed_gender;
      if (updateData.min_age !== undefined) transformedData.minAge = updateData.min_age;
      if (updateData.max_age !== undefined) transformedData.maxAge = updateData.max_age;
      if (updateData.requirements !== undefined) transformedData.requirements = updateData.requirements;
      if (updateData.price !== undefined) transformedData.price = updateData.price;
      if (updateData.price_includes !== undefined) transformedData.priceIncludes = updateData.price_includes;
      if (updateData.price_excludes !== undefined) transformedData.priceExcludes = updateData.price_excludes;
      if (updateData.included_items !== undefined) transformedData.includedItems = updateData.included_items;
      if (updateData.optional_items !== undefined) transformedData.optionalItems = updateData.optional_items;
      if (updateData.accommodation !== undefined) transformedData.accommodation = updateData.accommodation;
      if (updateData.refund_policy !== undefined) transformedData.refundPolicy = updateData.refund_policy;
      if (updateData.status !== undefined) transformedData.status = updateData.status;
      if (updateData.visibility !== undefined) transformedData.visibility = updateData.visibility;

      await influencerService.updateCourse(id, req.user.id, transformedData);

      successResponse(res, null, '코스가 수정되었습니다');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 수정 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /influencer/courses/:id/participants
   * Get participants for a course
   */
  async getParticipants(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await influencerService.getParticipants(id, req.user.id);

      successResponse(res, {
        summary: {
          pending: result.summary.pending,
          confirmed: result.summary.confirmed,
          rejected: result.summary.rejected,
          max_participants: result.summary.maxParticipants,
        },
        items: result.items.map((item) => ({
          id: item.id,
          user_id: item.userId,
          applicant_name: item.applicantName,
          phone: item.phone,
          instagram_url: item.instagramUrl,
          age: item.age,
          gender: item.gender,
          introduction: item.introduction,
          status: item.status,
          applied_at: item.appliedAt,
          paid_amount: item.paidAmount,
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '참가자 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * POST /influencer/courses/:id/announcements
   * Create an announcement for a course
   */
  async createAnnouncement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, images, is_pinned } = req.body;

      if (!title || !content) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '제목과 내용을 입력해주세요', 400);
        return;
      }

      const result = await influencerService.createAnnouncement(id, req.user.id, {
        title,
        content,
        images,
        isPinned: is_pinned,
      });

      createdResponse(res, { id: result.id }, '공지사항이 등록되었습니다');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '공지사항 작성 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /influencer/courses/:id/announcements
   * Get announcements for a course
   */
  async getAnnouncements(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const announcements = await influencerService.getAnnouncements(id, req.user.id);

      successResponse(res, { items: announcements });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '공지사항 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /influencer/courses/:id/expenses
   * Update expense request for participants
   */
  async updateExpenses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { requested_amount } = req.body;

      if (!requested_amount || requested_amount <= 0) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '요청 금액을 입력해주세요', 400);
        return;
      }

      await influencerService.updateExpense(id, req.user.id, requested_amount);

      successResponse(res, null, '경비 충전 요청이 전송되었습니다');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '경비 충전 요청 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * POST /influencer/courses/:id/nbang
   * Create N빵 settlement
   */
  async createNbang(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, total_amount, participant_ids, include_fee_in_amount } = req.body;

      if (!title || !total_amount || !participant_ids || participant_ids.length === 0) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
        return;
      }

      const result = await influencerService.createNbang(id, req.user.id, {
        title,
        description,
        totalAmount: total_amount,
        participantIds: participant_ids,
        includeFeeInAmount: include_fee_in_amount,
      });

      successResponse(res, {
        id: result.id,
        per_person_amount: result.perPersonAmount,
        participant_count: result.participantCount,
        insufficient_balance_users: result.insufficientBalanceUsers,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'INFLUENCER_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'COURSE_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, 'N빵 정산 추가 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /influencer/settlements
   * Get influencer settlements
   */
  async getSettlements(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, from_date, to_date } = req.query;

      const result = await influencerService.getSettlements(req.user.id, {
        page,
        limit,
        status: status as string,
        fromDate: from_date as string,
        toDate: to_date as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서 프로필을 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '정산 내역 조회 중 오류가 발생했습니다', 500);
    }
  },
};

export default influencerController;
