import { Router } from 'express';
import { authenticate, optionalAuth, requireInfluencer } from '../middlewares/auth.middleware';
import { courseController } from '../controllers/courseController';

const router = Router();

/**
 * GET /courses
 * Get paginated list of courses with filters
 */
router.get('/', optionalAuth, courseController.getList);

/**
 * GET /courses/featured
 * Get featured courses for homepage
 */
router.get('/featured', optionalAuth, courseController.getFeatured);

/**
 * GET /courses/:id
 * Get detailed course information
 */
router.get('/:id', optionalAuth, courseController.getDetail);

/**
 * POST /courses/:id/apply
 * Apply to a course
 */
router.post('/:id/apply', authenticate, courseController.apply);

/**
 * DELETE /courses/:id/applications/:applicationId
 * Cancel a course application
 */
router.delete('/:id/applications/:applicationId', authenticate, courseController.cancelApplication);

/**
 * GET /courses/:id/applications
 * Get all applications for a course (influencer only)
 */
router.get('/:id/applications', authenticate, requireInfluencer, courseController.getApplications);

export default router;
