import { Router, Response } from 'express';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { authenticate, requireInfluencer, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// All influencer routes require authentication and influencer role
router.use(authenticate);
router.use(requireInfluencer);

/**
 * POST /influencer/courses
 * 새 코스 등록
 */
router.post('/courses', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const courseData = req.body;

    // TODO: Validate course data
    // TODO: Create course in database
    // const course = await courseService.create(req.user.id, courseData);

    // Placeholder response
    createdResponse(res, {
      id: 'new-course-uuid',
    }, '코스가 등록되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 등록 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /influencer/courses/:id
 * 코스 수정
 */
router.put('/courses/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    // TODO: Verify course belongs to this influencer
    // TODO: Update course in database
    // const course = await courseService.update(id, req.user.id, courseData);

    successResponse(res, null, '코스가 수정되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '코스 수정 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /influencer/courses/:id/applications
 * 코스 신청자 목록
 */
router.get('/courses/:id/applications', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Verify course belongs to this influencer
    // TODO: Fetch applications
    // const applications = await applicationService.getCourseApplications(id);

    // Placeholder response
    successResponse(res, {
      summary: {
        pending: 0,
        confirmed: 0,
        rejected: 0,
        max_participants: 10,
      },
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '신청자 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /influencer/applications/:id/select
 * 신청자 선정 처리
 */
router.put('/applications/:id/select', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Verify application belongs to influencer's course
    // TODO: Update application status to confirmed
    // await applicationService.selectApplicant(id);

    successResponse(res, null, '신청자가 선정되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '신청자 선정 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /influencer/applications/:id/reject
 * 신청자 미선정 처리
 */
router.put('/applications/:id/reject', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Verify application belongs to influencer's course
    // TODO: Update application status to rejected
    // TODO: Process refund
    // await applicationService.rejectApplicant(id);

    successResponse(res, null, '신청자가 미선정 처리되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '신청자 미선정 처리 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /influencer/courses/:id/close-recruitment
 * 모집 마감 및 미선정자 일괄 환불
 */
router.post('/courses/:id/close-recruitment', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Verify course belongs to this influencer
    // TODO: Close recruitment
    // TODO: Process batch refunds for rejected applicants
    // await courseService.closeRecruitment(id);

    successResponse(res, null, '모집이 마감되었습니다. 미선정자 환불이 처리됩니다.');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '모집 마감 처리 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /influencer/courses/:id/request-expense
 * 참가자들에게 경비 충전 요청
 */
router.post('/courses/:id/request-expense', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { requested_amount } = req.body;

    if (!requested_amount || requested_amount <= 0) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '요청 금액을 입력해주세요', 400);
    }

    // TODO: Verify course belongs to this influencer
    // TODO: Update requested expense amount
    // TODO: Send notifications to participants
    // await expenseService.requestExpense(id, requested_amount);

    successResponse(res, null, '경비 충전 요청이 전송되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '경비 충전 요청 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /influencer/courses/:id/nbang-items
 * N빵 정산 항목 추가
 */
router.post('/courses/:id/nbang-items', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, total_amount, participant_ids, include_fee_in_amount } = req.body;

    if (!title || !total_amount || !participant_ids || participant_ids.length === 0) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '필수 정보를 모두 입력해주세요', 400);
    }

    // TODO: Verify course belongs to this influencer
    // TODO: Calculate per-person amount
    // TODO: Deduct from participants' expense balances
    // TODO: Check for insufficient balances
    // const result = await expenseService.createNbangItem(id, {
    //   title,
    //   total_amount,
    //   participant_ids,
    //   include_fee_in_amount,
    // });

    const perPersonAmount = Math.ceil(total_amount / participant_ids.length);

    successResponse(res, {
      id: 'nbang-item-uuid',
      per_person_amount: perPersonAmount,
      participant_count: participant_ids.length,
      insufficient_balance_users: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, 'N빵 정산 추가 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /influencer/courses/:id/announcements
 * 코스 공지사항 작성
 */
router.post('/courses/:id/announcements', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, images, is_pinned } = req.body;

    if (!title || !content) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '제목과 내용을 입력해주세요', 400);
    }

    // TODO: Verify course belongs to this influencer
    // TODO: Create announcement
    // TODO: Send notifications to participants
    // const announcement = await announcementService.create(id, {
    //   title,
    //   content,
    //   images,
    //   is_pinned,
    // });

    createdResponse(res, {
      id: 'announcement-uuid',
    }, '공지사항이 등록되었습니다');
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '공지사항 작성 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /influencer/settlements
 * 내 정산 내역
 */
router.get('/settlements', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, from_date, to_date, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // TODO: Fetch influencer's settlements
    // const settlements = await settlementService.getInfluencerSettlements(req.user.id, {
    //   status,
    //   from_date,
    //   to_date,
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
    errorResponse(res, ErrorCodes.SERVER_ERROR, '정산 내역 조회 중 오류가 발생했습니다', 500);
  }
});

export default router;
