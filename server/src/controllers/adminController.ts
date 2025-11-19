import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse, paginatedResponse, parsePagination } from '../utils/response';
import { adminService } from '../services/adminService';

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  ALREADY_PROCESSED: 'ALREADY_PROCESSED',
} as const;

// Admin Controller
export const adminController = {
  /**
   * GET /admin/dashboard
   * Get admin dashboard statistics
   */
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await adminService.getDashboard();

      successResponse(res, {
        total_users: stats.totalUsers,
        new_users_today: stats.newUsersToday,
        total_influencers: stats.totalInfluencers,
        pending_influencers: stats.pendingInfluencers,
        total_courses: stats.totalCourses,
        active_courses: stats.activeCourses,
        total_revenue: stats.totalRevenue,
        pending_settlements: stats.pendingSettlements,
        completed_settlements: stats.completedSettlements,
      });
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '대시보드 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/users
   * Get all users with pagination
   */
  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { role, status, search } = req.query;

      const result = await adminService.getUsers({
        page,
        limit,
        role: role as string,
        status: status as string,
        search: search as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '사용자 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /admin/users/:id/status
   * Update user status (activate/suspend)
   */
  async updateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'suspended'].includes(status)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '유효한 상태값을 입력해주세요', 400);
        return;
      }

      await adminService.updateUserStatus(id, status);

      const message = status === 'active' ? '사용자가 활성화되었습니다' : '사용자가 정지되었습니다';
      successResponse(res, null, message);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '사용자 상태 변경 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/influencers
   * Get all influencers with pagination
   */
  async getInfluencers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, search } = req.query;

      const result = await adminService.getInfluencers({
        page,
        limit,
        status: status as string,
        search: search as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '인플루언서 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /admin/influencer-applications/:id/approve
   * Approve influencer application
   */
  async approveInfluencer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await adminService.approveInfluencer(id);

      successResponse(res, null, '인플루언서 승인이 완료되었습니다');
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서를 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '인플루언서 승인 처리 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /admin/influencer-applications/:id/reject
   * Reject influencer application
   */
  async rejectInfluencer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '반려 사유를 입력해주세요', 400);
        return;
      }

      await adminService.rejectInfluencer(id, reason);

      successResponse(res, null, '인플루언서 신청이 반려되었습니다');
    } catch (error) {
      if (error instanceof Error && error.message === 'INFLUENCER_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '인플루언서를 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '인플루언서 반려 처리 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/payments
   * Get all payments with pagination
   */
  async getPayments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, payment_type, from_date, to_date } = req.query;

      const result = await adminService.getPayments({
        page,
        limit,
        status: status as string,
        paymentType: payment_type as string,
        fromDate: from_date as string,
        toDate: to_date as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '결제 내역 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/settlements
   * Get all settlements with pagination
   */
  async getSettlements(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, from_date, to_date } = req.query;

      const result = await adminService.getSettlements({
        page,
        limit,
        status: status as string,
        fromDate: from_date as string,
        toDate: to_date as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '정산 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * POST /admin/settlements/:id/process
   * Process settlement payout
   */
  async processSettlement(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await adminService.processSettlement(id);

      successResponse(res, null, '정산이 처리되었습니다');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'SETTLEMENT_NOT_FOUND') {
          errorResponse(res, ErrorCodes.NOT_FOUND, '정산 내역을 찾을 수 없습니다', 404);
          return;
        }
        if (error.message === 'SETTLEMENT_ALREADY_PROCESSED') {
          errorResponse(res, ErrorCodes.ALREADY_PROCESSED, '이미 처리된 정산입니다', 400);
          return;
        }
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '정산 처리 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/inquiries
   * Get support inquiries with pagination
   */
  async getInquiries(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
      const { status, category } = req.query;

      const result = await adminService.getInquiries({
        page,
        limit,
        status: status as string,
        category: category as string,
      });

      paginatedResponse(res, result.items, result.total, page, limit);
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '문의 목록 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * POST /admin/inquiries/:id/respond
   * Respond to an inquiry
   */
  async respondToInquiry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '답변 내용을 입력해주세요', 400);
        return;
      }

      await adminService.respondToInquiry(id, req.user.id, { content });

      successResponse(res, null, '답변이 등록되었습니다');
    } catch (error) {
      if (error instanceof Error && error.message === 'INQUIRY_NOT_FOUND') {
        errorResponse(res, ErrorCodes.NOT_FOUND, '문의를 찾을 수 없습니다', 404);
        return;
      }
      errorResponse(res, ErrorCodes.SERVER_ERROR, '답변 등록 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/settings/fees
   * Get fee settings
   */
  async getFeeSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const fees = await adminService.getFeeSettings();

      successResponse(res, {
        default_course_fee_rate: fees.defaultCourseFeeRate,
        default_party_fee_rate: fees.defaultPartyFeeRate,
        pg_fee_rate: fees.pgFeeRate,
      });
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '수수료 설정 조회 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * PUT /admin/settings/fees
   * Update fee settings
   */
  async updateFeeSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { default_course_fee_rate, default_party_fee_rate, pg_fee_rate } = req.body;

      await adminService.updateFeeSettings(req.user.id, {
        defaultCourseFeeRate: default_course_fee_rate,
        defaultPartyFeeRate: default_party_fee_rate,
        pgFeeRate: pg_fee_rate,
      });

      successResponse(res, null, '수수료 설정이 변경되었습니다');
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '수수료 설정 변경 중 오류가 발생했습니다', 500);
    }
  },

  /**
   * GET /admin/analytics
   * Get analytics data
   */
  async getAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { from_date, to_date, type } = req.query;

      const analytics = await adminService.getAnalytics({
        fromDate: from_date as string,
        toDate: to_date as string,
        type: type as string,
      });

      successResponse(res, {
        summary: {
          total_users: analytics.summary.totalUsers,
          new_users: analytics.summary.newUsers,
          total_revenue: analytics.summary.totalRevenue,
          total_settlements: analytics.summary.totalSettlements,
        },
        charts: analytics.charts,
      });
    } catch (error) {
      errorResponse(res, ErrorCodes.SERVER_ERROR, '통계 조회 중 오류가 발생했습니다', 500);
    }
  },
};

export default adminController;
