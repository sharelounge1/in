import { Router } from 'express';
import { successResponse } from '../utils/response';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import coursesRoutes from './courses.routes';
import myRoutes from './my.routes';
import partiesRoutes from './parties.routes';
import influencerRoutes from './influencer.routes';
import paymentsRoutes from './payments.routes';
import settlementsRoutes from './settlements.routes';
import adminRoutes from './admin.routes';
import inquiriesRoutes from './inquiries.routes';
import announcementsRoutes from './announcements.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API version info
router.get('/', (req, res) => {
  successResponse(res, {
    name: 'Influencer Travel Platform API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/courses', coursesRoutes);
router.use('/my', myRoutes);
router.use('/parties', partiesRoutes);
router.use('/influencer', influencerRoutes);
router.use('/payments', paymentsRoutes);
router.use('/settlements', settlementsRoutes);
router.use('/admin', adminRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/announcements', announcementsRoutes);

export default router;
