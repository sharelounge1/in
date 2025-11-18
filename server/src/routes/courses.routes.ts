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
 * GET /courses
 * 공개된 코스 목록
 */
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, country, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // TODO: Fetch courses from database
    // const courses = await courseService.getList({
    //   status,
    //   country,
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
    errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /courses/featured
 * 메인 화면용 추천 코스
 */
router.get('/featured', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Fetch featured courses from database
    // const courses = await courseService.getFeatured();

    // Placeholder response
    successResponse(res, {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '추천 코스 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /courses/:id
 * 코스 전체 정보
 */
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch course detail from database
    // const course = await courseService.getDetail(id, req.user?.id);

    // if (!course) {
    //   return errorResponse(res, ErrorCodes.NOT_FOUND, '코스를 찾을 수 없습니다', 404);
    // }

    // Placeholder response
    successResponse(res, {
      id,
      title: '코스 제목',
      description: '코스 설명',
      thumbnail_url: '',
      images: [],
      country: '한국',
      city: '서울',
      start_date: '2025-03-01',
      end_date: '2025-03-06',
      total_days: 6,
      recruitment_start: '2025-01-15',
      recruitment_end: '2025-02-15',
      min_participants: 5,
      max_participants: 10,
      current_participants: 0,
      allowed_gender: 'all',
      min_age: 20,
      max_age: 40,
      price: 1500000,
      included_items: [],
      optional_items: [],
      accommodation: null,
      refund_policy: '',
      status: 'recruiting',
      influencer: {
        id: 'influencer-id',
        display_name: '인플루언서',
        avatar_url: '',
        instagram_url: '',
        average_rating: 0,
      },
      days: [],
      is_applied: false,
      can_apply: true,
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 상세 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /courses/:id/apply
 * 코스 참가 신청
 */
router.post('/:id/apply', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { applicant_name, phone, instagram_url, age, gender, introduction } = req.body;

    if (!applicant_name || !phone || !age || !gender || !introduction) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
    }

    // TODO: Create application
    // 1. Check if course exists and is recruiting
    // 2. Check if user already applied
    // 3. Create application record
    // 4. Generate payment request

    // Placeholder response
    successResponse(res, {
      application_id: 'application-uuid',
      payment_request: {
        merchant_uid: `order_${Date.now()}`,
        amount: 1500000,
        name: '코스 이름',
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 신청 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /courses/:id/announcements
 * 코스 공지사항 조회
 */
router.get('/:id/announcements', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch announcements
    // 1. Verify user is participant of this course
    // 2. Fetch announcements from database
    // const announcements = await announcementService.getList(id);

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '공지사항 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /courses/:id/my-expenses
 * 내 경비 잔액 및 거래 내역
 */
router.get('/:id/my-expenses', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch user's expense data for this course
    // const expenses = await expenseService.getUserExpenses(id, req.user.id);

    // Placeholder response
    successResponse(res, {
      balance: 0,
      total_charged: 0,
      total_used: 0,
      requested_amount: 0,
      transactions: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '경비 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /courses/:id/charge-expense
 * 경비 충전 결제
 */
router.post('/:id/charge-expense', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '충전 금액을 입력해주세요', 400);
    }

    // TODO: Create expense charge payment request
    // const paymentRequest = await expenseService.createChargeRequest(id, req.user.id, amount);

    // Placeholder response
    successResponse(res, {
      payment_request: {
        merchant_uid: `expense_${Date.now()}`,
        amount,
        name: '경비 충전',
      },
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '경비 충전 요청 중 오류가 발생했습니다', 500);
  }
});

export default router;
