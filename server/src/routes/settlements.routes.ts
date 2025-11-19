import { Router } from 'express';
import { authenticate, requireInfluencer } from '../middlewares/auth.middleware';
import { settlementController } from '../controllers/settlementController';

const router = Router();

// All settlement routes require authentication and influencer role

/**
 * GET /settlements
 * Get influencer's settlements
 */
router.get('/', authenticate, requireInfluencer, settlementController.getSettlements);

/**
 * GET /settlements/summary
 * Get influencer's settlement summary
 */
router.get('/summary', authenticate, requireInfluencer, settlementController.getSummary);

/**
 * POST /settlements/calculate
 * Calculate settlement for a course/party
 */
router.post('/calculate', authenticate, requireInfluencer, settlementController.calculate);

/**
 * GET /settlements/:id
 * Get settlement detail
 */
router.get('/:id', authenticate, requireInfluencer, settlementController.getDetail);

export default router;
