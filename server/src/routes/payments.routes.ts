import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { paymentController } from '../controllers/paymentController';

const router = Router();

/**
 * POST /payments
 * Create a new payment
 */
router.post('/', authenticate, paymentController.create);

/**
 * POST /payments/complete
 * PG 결제 완료 후 처리 (legacy endpoint)
 */
router.post('/complete', authenticate, paymentController.complete);

/**
 * GET /payments
 * Get user's payment history
 */
router.get('/', authenticate, paymentController.getHistory);

/**
 * GET /payments/:id
 * Get payment detail
 */
router.get('/:id', authenticate, paymentController.getDetail);

/**
 * POST /payments/:id/verify
 * Verify payment with PG response
 */
router.post('/:id/verify', authenticate, paymentController.verify);

/**
 * POST /payments/:id/refund
 * Request refund for a payment
 */
router.post('/:id/refund', authenticate, paymentController.refund);

export default router;
