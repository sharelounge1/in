import { Router, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// Error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

/**
 * POST /payments/complete
 * PG 결제 완료 후 처리
 */
router.post('/complete', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imp_uid, merchant_uid } = req.body;

    if (!imp_uid || !merchant_uid) {
      return errorResponse(res, ErrorCodes.VALIDATION_ERROR, '결제 정보가 누락되었습니다', 400);
    }

    // TODO: Implement payment completion logic
    // 1. Verify payment with Iamport API
    // 2. Check payment amount matches expected amount
    // 3. Update payment status in database
    // 4. Update related application status
    // 5. Send confirmation notification
    // const result = await paymentService.completePayment(req.user.id, imp_uid, merchant_uid);

    successResponse(res, {
      payment_id: 'payment-uuid',
      status: 'paid',
      message: '결제가 완료되었습니다',
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.PAYMENT_FAILED, '결제 처리 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /payments/:id
 * 결제 상세 조회
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch payment detail from database
    // const payment = await paymentService.getDetail(id, req.user.id);

    // Placeholder response
    successResponse(res, {
      id,
      merchant_uid: 'order_123',
      imp_uid: 'imp_123',
      amount: 1500000,
      status: 'paid',
      payment_method: 'card',
      paid_at: new Date().toISOString(),
      receipt_url: '',
      related_type: 'course',
      related_id: 'course-uuid',
      related_title: '코스 이름',
    });
  } catch (error) {
    errorResponse(res, ErrorCodes.SERVER_ERROR, '결제 상세 조회 중 오류가 발생했습니다', 500);
  }
});

export default router;
