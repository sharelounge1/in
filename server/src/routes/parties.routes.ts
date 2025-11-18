import { Router, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { authenticate, optionalAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;

/**
 * GET /parties
 * 파티 목록 조회
 */
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { region, date_from, date_to, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // TODO: Fetch parties from database
    // const parties = await partyService.getList({
    //   region,
    //   date_from,
    //   date_to,
    //   page: pageNum,
    //   limit: limitNum,
    // });

    // Placeholder response
    successResponse(res, {
      items: [],
      total: 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '파티 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /parties/:id
 * 파티 상세 정보
 */
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch party detail from database
    // const party = await partyService.getDetail(id, req.user?.id);

    // if (!party) {
    //   return errorResponse(res, ErrorCodes.NOT_FOUND, '파티를 찾을 수 없습니다', 404);
    // }

    // Placeholder response
    successResponse(res, {
      id,
      title: '파티 제목',
      description: '파티 설명',
      thumbnail_url: '',
      images: [],
      region: '서울',
      venue: '',
      event_date: '2025-03-01',
      start_time: '19:00',
      end_time: '22:00',
      price: 50000,
      min_participants: 10,
      max_participants: 50,
      current_participants: 0,
      status: 'recruiting',
      influencer: {
        id: 'influencer-id',
        display_name: '인플루언서',
        avatar_url: '',
      },
      is_applied: false,
      can_apply: true,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '파티 상세 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /parties/:id/apply
 * 파티 참가 신청
 */
router.post('/:id/apply', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { applicant_name, phone, instagram_url, age, gender, introduction } = req.body;

    if (!applicant_name || !phone || !age || !gender || !introduction) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
    }

    // TODO: Create party application
    // 1. Check if party exists and is recruiting
    // 2. Check if user already applied
    // 3. Create application record
    // 4. Generate payment request

    // Placeholder response
    successResponse(res, {
      application_id: 'application-uuid',
      payment_request: {
        merchant_uid: `party_${Date.now()}`,
        amount: 50000,
        name: '파티 이름',
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '파티 신청 중 오류가 발생했습니다', 500);
  }
});

export default router;
