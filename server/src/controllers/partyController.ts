import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { successResponse, errorResponse, paginatedResponse, parsePagination, createdResponse } from '../utils/response';
import { partyService, PartyCreateData, PartyUpdateData, PartyJoinData } from '../services/partyService';

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
} as const;

/**
 * Party Controller
 * Handles all party-related HTTP requests
 */
export const partyController = {
  /**
   * GET /parties
   * Get paginated list of parties with filters
   */
  async getList(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { region, date_from, date_to, status } = req.query;
      const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });

      const result = await partyService.getList({
        region: region as string | undefined,
        date_from: date_from as string | undefined,
        date_to: date_to as string | undefined,
        status: status as string | undefined,
        page,
        limit,
      });

      paginatedResponse(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : '파티 목록 조회 중 오류가 발생했습니다';
      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * GET /parties/:id
   * Get detailed party information
   */
  async getDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const party = await partyService.getDetail(id, userId);

      if (!party) {
        errorResponse(res, ErrorCodes.NOT_FOUND, '파티를 찾을 수 없습니다', 404);
        return;
      }

      successResponse(res, party);
    } catch (error) {
      const message = error instanceof Error ? error.message : '파티 상세 조회 중 오류가 발생했습니다';
      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * POST /parties
   * Create a new party (influencer only)
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const {
        title,
        description,
        thumbnail_url,
        images,
        location_name,
        location_address,
        map_url,
        event_date,
        start_time,
        end_time,
        recruitment_start,
        recruitment_end,
        min_participants,
        max_participants,
        allowed_gender,
        min_age,
        max_age,
        price,
        price_description,
        refund_policy,
      } = req.body;

      // Validate required fields
      if (!title || !event_date || !recruitment_start || !recruitment_end || !max_participants || price === undefined) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
        return;
      }

      // Validate title length
      if (title.length > 200) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '제목은 200자 이내로 입력해주세요', 400);
        return;
      }

      // Validate price
      if (typeof price !== 'number' || price < 0) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 가격을 입력해주세요', 400);
        return;
      }

      // Validate max participants
      if (typeof max_participants !== 'number' || max_participants < 1) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '최대 참가 인원은 1명 이상이어야 합니다', 400);
        return;
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(event_date) || !dateRegex.test(recruitment_start) || !dateRegex.test(recruitment_end)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)', 400);
        return;
      }

      const createData: PartyCreateData = {
        title,
        description,
        thumbnail_url,
        images,
        location_name,
        location_address,
        map_url,
        event_date,
        start_time,
        end_time,
        recruitment_start,
        recruitment_end,
        min_participants,
        max_participants,
        allowed_gender,
        min_age,
        max_age,
        price,
        price_description,
        refund_policy,
      };

      const result = await partyService.create(userId, createData);

      createdResponse(res, result, '파티가 생성되었습니다');
    } catch (error) {
      const message = error instanceof Error ? error.message : '파티 생성 중 오류가 발생했습니다';

      if (message.includes('인플루언서') || message.includes('인증')) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, message, 403);
        return;
      }
      if (message.includes('날짜') || message.includes('마감')) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, message, 400);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * PUT /parties/:id
   * Update a party (influencer only)
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const {
        title,
        description,
        thumbnail_url,
        images,
        location_name,
        location_address,
        map_url,
        event_date,
        start_time,
        end_time,
        recruitment_start,
        recruitment_end,
        min_participants,
        max_participants,
        allowed_gender,
        min_age,
        max_age,
        price,
        price_description,
        refund_policy,
        status,
      } = req.body;

      // Validate title length if provided
      if (title && title.length > 200) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '제목은 200자 이내로 입력해주세요', 400);
        return;
      }

      // Validate price if provided
      if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 가격을 입력해주세요', 400);
        return;
      }

      // Validate max participants if provided
      if (max_participants !== undefined && (typeof max_participants !== 'number' || max_participants < 1)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '최대 참가 인원은 1명 이상이어야 합니다', 400);
        return;
      }

      // Validate status if provided
      const validStatuses = ['draft', 'recruiting', 'closed', 'ongoing', 'completed', 'cancelled'];
      if (status && !validStatuses.includes(status)) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, '올바른 상태값이 아닙니다', 400);
        return;
      }

      const updateData: PartyUpdateData = {
        title,
        description,
        thumbnail_url,
        images,
        location_name,
        location_address,
        map_url,
        event_date,
        start_time,
        end_time,
        recruitment_start,
        recruitment_end,
        min_participants,
        max_participants,
        allowed_gender,
        min_age,
        max_age,
        price,
        price_description,
        refund_policy,
        status,
      };

      const result = await partyService.update(id, userId, updateData);

      successResponse(res, result, '파티가 수정되었습니다');
    } catch (error) {
      const message = error instanceof Error ? error.message : '파티 수정 중 오류가 발생했습니다';

      if (message.includes('찾을 수 없습니다')) {
        errorResponse(res, ErrorCodes.NOT_FOUND, message, 404);
        return;
      }
      if (message.includes('본인')) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, message, 403);
        return;
      }
      if (message.includes('완료') || message.includes('취소') || message.includes('날짜')) {
        errorResponse(res, ErrorCodes.VALIDATION_ERROR, message, 400);
        return;
      }

      errorResponse(res, ErrorCodes.SERVER_ERROR, message, 500);
    }
  },

  /**
   * POST /parties/:id/join
   * Join a party
   */
  async join(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const { applicant_name, phone, instagram_url, age, gender, introduction } = req.body;

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

      const joinData: PartyJoinData = {
        applicant_name,
        phone: phone.replace(/-/g, ''),
        instagram_url: instagram_url || '',
        age,
        gender,
        introduction: introduction || '',
      };

      const result = await partyService.join(id, userId, joinData);

      successResponse(res, result, '파티 참가 신청이 완료되었습니다');
    } catch (error) {
      const message = error instanceof Error ? error.message : '파티 신청 중 오류가 발생했습니다';

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
   * GET /parties/:id/applications
   * Get all applications for a party (influencer only)
   */
  async getApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        errorResponse(res, ErrorCodes.AUTH_UNAUTHORIZED, '인증이 필요합니다', 401);
        return;
      }

      const result = await partyService.getApplications(id, userId);

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

export default partyController;
