import { Router } from 'express';
import { authenticate, optionalAuth, requireInfluencer } from '../middlewares/auth.middleware';
import { partyController } from '../controllers/partyController';

const router = Router();

/**
 * GET /parties
 * Get paginated list of parties with filters
 */
router.get('/', optionalAuth, partyController.getList);

/**
 * GET /parties/:id
 * Get detailed party information
 */
router.get('/:id', optionalAuth, partyController.getDetail);

/**
 * POST /parties
 * Create a new party (influencer only)
 */
router.post('/', authenticate, requireInfluencer, partyController.create);

/**
 * PUT /parties/:id
 * Update a party (influencer only)
 */
router.put('/:id', authenticate, requireInfluencer, partyController.update);

/**
 * POST /parties/:id/join
 * Join a party
 */
router.post('/:id/join', authenticate, partyController.join);

/**
 * GET /parties/:id/applications
 * Get all applications for a party (influencer only)
 */
router.get('/:id/applications', authenticate, requireInfluencer, partyController.getApplications);

export default router;
