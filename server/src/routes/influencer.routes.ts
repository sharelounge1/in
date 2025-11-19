import { Router } from 'express';
import { authenticate, requireInfluencer } from '../middlewares/auth.middleware';
import { influencerController } from '../controllers/influencerController';

const router = Router();

// All influencer routes require authentication and influencer role
router.use(authenticate);
router.use(requireInfluencer);

/**
 * GET /influencer/dashboard
 * Get influencer dashboard statistics
 */
router.get('/dashboard', influencerController.getDashboard);

/**
 * GET /influencer/courses
 * Get influencer's courses
 */
router.get('/courses', influencerController.getCourses);

/**
 * POST /influencer/courses
 * Create a new course
 */
router.post('/courses', influencerController.createCourse);

/**
 * PUT /influencer/courses/:id
 * Update an existing course
 */
router.put('/courses/:id', influencerController.updateCourse);

/**
 * GET /influencer/courses/:id/participants
 * Get participants for a course
 */
router.get('/courses/:id/participants', influencerController.getParticipants);

/**
 * POST /influencer/courses/:id/announcements
 * Create an announcement for a course
 */
router.post('/courses/:id/announcements', influencerController.createAnnouncement);

/**
 * GET /influencer/courses/:id/announcements
 * Get announcements for a course
 */
router.get('/courses/:id/announcements', influencerController.getAnnouncements);

/**
 * PUT /influencer/courses/:id/expenses
 * Update expense request for participants
 */
router.put('/courses/:id/expenses', influencerController.updateExpenses);

/**
 * POST /influencer/courses/:id/nbang
 * Create N빵 settlement
 */
router.post('/courses/:id/nbang', influencerController.createNbang);

/**
 * GET /influencer/settlements
 * Get influencer settlements
 */
router.get('/settlements', influencerController.getSettlements);

export default router;
