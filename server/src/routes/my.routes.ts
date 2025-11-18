import { Router, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

/**
 * GET /my/applications
 * 내가 신청한 코스/파티 목록
 */
router.get('/applications', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type } = req.query;

    // TODO: Fetch user's applications from database
    // const applications = await applicationService.getUserApplications(req.user.id, {
    //   type: type as string,
    // });

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '신청 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /my/active-travels
 * 참가 확정된 진행 중 여행
 */
router.get('/active-travels', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Fetch user's active travels
    // const travels = await travelService.getActiveTravels(req.user.id);

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '진행 중 여행 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /my/payments
 * 내 결제 내역
 */
router.get('/payments', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Fetch user's payment history
    // const payments = await paymentService.getUserPayments(req.user.id);

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '결제 내역 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /my/reviews
 * 내가 작성한 후기
 */
router.get('/reviews', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Fetch user's reviews
    // const reviews = await reviewService.getUserReviews(req.user.id);

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '후기 목록 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /my/inquiries
 * 내가 등록한 문의
 */
router.get('/inquiries', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Fetch user's inquiries
    // const inquiries = await inquiryService.getUserInquiries(req.user.id);

    // Placeholder response
    successResponse(res, {
      items: [],
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '문의 목록 조회 중 오류가 발생했습니다', 500);
  }
});

export default router;
