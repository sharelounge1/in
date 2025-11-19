import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { paymentService } from '../services/paymentService';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  errorResponse,
  parsePagination,
} from '../utils/response';
import { asyncHandler, NotFoundError, BadRequestError } from '../middlewares/errorHandler';

// Validation schemas
const createPaymentSchema = z.object({
  application_id: z.string().uuid('올바른 신청 ID가 아닙니다'),
  amount: z.number().positive('금액은 0보다 커야 합니다'),
  method: z.string().min(1, '결제 수단을 선택해주세요'),
  payment_type: z.enum(['course_fee', 'party_fee', 'expense_charge']),
  reference_type: z.enum(['course', 'party']),
  reference_id: z.string().uuid('올바른 참조 ID가 아닙니다'),
});

const verifyPaymentSchema = z.object({
  imp_uid: z.string().min(1, '아임포트 UID가 필요합니다'),
  merchant_uid: z.string().min(1, '주문번호가 필요합니다'),
  status: z.string(),
  amount: z.number(),
  pg_provider: z.string().optional(),
  pg_tid: z.string().optional(),
  receipt_url: z.string().optional(),
});

const refundPaymentSchema = z.object({
  reason: z.string().min(1, '환불 사유를 입력해주세요'),
  amount: z.number().positive().optional(),
});

/**
 * Payment Controller
 */
export const paymentController = {
  /**
   * POST /payments
   * Create a new payment
   */
  create: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const validatedData = createPaymentSchema.parse(req.body);

    const payment = await paymentService.create({
      userId,
      applicationId: validatedData.application_id,
      amount: validatedData.amount,
      method: validatedData.method,
      paymentType: validatedData.payment_type,
      referenceType: validatedData.reference_type,
      referenceId: validatedData.reference_id,
    });

    // Extract merchant_uid from pg_response for client
    const pgResponse = payment.pg_response as Record<string, unknown>;

    createdResponse(res, {
      payment_id: payment.id,
      merchant_uid: pgResponse.merchant_uid,
      amount: payment.amount,
      status: payment.status,
    }, '결제가 생성되었습니다');
  }),

  /**
   * POST /payments/:id/verify
   * Verify payment with PG response
   */
  verify: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const pgResponse = verifyPaymentSchema.parse(req.body);

    const payment = await paymentService.verify(id, pgResponse);

    successResponse(res, {
      payment_id: payment.id,
      status: payment.status,
      paid_at: payment.paid_at,
      message: '결제가 완료되었습니다',
    });
  }),

  /**
   * GET /payments
   * Get user's payment history
   */
  getHistory: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
    const { status } = req.query;

    const { items, total } = await paymentService.getHistory(userId, {
      page,
      limit,
      status: status as string | undefined,
    });

    paginatedResponse(res, items, total, page, limit);
  }),

  /**
   * POST /payments/:id/refund
   * Request refund for a payment
   */
  refund: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const validatedData = refundPaymentSchema.parse(req.body);

    // Verify the payment belongs to the user
    const existingPayment = await paymentService.getDetail(id, userId);
    if (!existingPayment) {
      throw new NotFoundError('결제 정보를 찾을 수 없습니다');
    }

    const payment = await paymentService.refund(
      id,
      validatedData.reason,
      validatedData.amount
    );

    successResponse(res, {
      payment_id: payment.id,
      status: payment.status,
      refunded_amount: payment.refunded_amount,
      refunded_at: payment.refunded_at,
      message: '환불이 처리되었습니다',
    });
  }),

  /**
   * GET /payments/:id
   * Get payment detail
   */
  getDetail: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await paymentService.getDetail(id, userId);

    // Get reference title
    let referenceTitle = '';
    if (payment.reference_type === 'course' && payment.reference_id) {
      // This would be fetched from courses table in a real implementation
      referenceTitle = '코스 제목';
    } else if (payment.reference_type === 'party' && payment.reference_id) {
      referenceTitle = '파티 제목';
    }

    successResponse(res, {
      id: payment.id,
      payment_type: payment.payment_type,
      amount: payment.amount,
      status: payment.status,
      payment_method: payment.payment_method,
      pg_provider: payment.pg_provider,
      pg_transaction_id: payment.pg_transaction_id,
      paid_at: payment.paid_at,
      refunded_amount: payment.refunded_amount,
      refund_reason: payment.refund_reason,
      refunded_at: payment.refunded_at,
      reference_type: payment.reference_type,
      reference_id: payment.reference_id,
      reference_title: referenceTitle,
      created_at: payment.created_at,
    });
  }),

  /**
   * POST /payments/complete (legacy endpoint for backwards compatibility)
   * Complete payment after PG callback
   */
  complete: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { imp_uid, merchant_uid } = req.body;

    if (!imp_uid || !merchant_uid) {
      throw new BadRequestError('결제 정보가 누락되었습니다');
    }

    // Find payment by merchant_uid
    const payment = await paymentService.getByMerchantUid(merchant_uid);
    if (!payment) {
      throw new NotFoundError('결제 정보를 찾을 수 없습니다');
    }

    // Verify with mock PG response (in production, verify with actual PG API)
    const verifiedPayment = await paymentService.verify(payment.id, {
      imp_uid,
      merchant_uid,
      status: 'paid',
      amount: payment.amount,
      pg_provider: 'mock',
    });

    successResponse(res, {
      payment_id: verifiedPayment.id,
      status: verifiedPayment.status,
      message: '결제가 완료되었습니다',
    });
  }),
};

/**
 * Admin Payment Controller
 */
export const adminPaymentController = {
  /**
   * GET /admin/payments
   * Get all payments (admin)
   */
  getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { page, limit } = parsePagination(req.query as { page?: string; limit?: string });
    const { status, from_date, to_date } = req.query;

    const { items, total } = await paymentService.getAdminPayments({
      page,
      limit,
      status: status as string | undefined,
      fromDate: from_date as string | undefined,
      toDate: to_date as string | undefined,
    });

    paginatedResponse(res, items, total, page, limit);
  }),

  /**
   * GET /admin/payments/:id
   * Get payment detail (admin)
   */
  getDetail: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const payment = await paymentService.getDetail(id);

    successResponse(res, payment);
  }),

  /**
   * POST /admin/payments/:id/refund
   * Admin refund (can refund any payment)
   */
  refund: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const validatedData = refundPaymentSchema.parse(req.body);

    const payment = await paymentService.refund(
      id,
      validatedData.reason,
      validatedData.amount
    );

    successResponse(res, {
      payment_id: payment.id,
      status: payment.status,
      refunded_amount: payment.refunded_amount,
      refunded_at: payment.refunded_at,
      message: '환불이 처리되었습니다',
    });
  }),
};

export default paymentController;
