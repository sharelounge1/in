import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { adminController } from '../controllers/adminController';
import { adminPaymentController } from '../controllers/paymentController';
import { adminSettlementController } from '../controllers/settlementController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /admin/dashboard
 * Get admin dashboard statistics
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * GET /admin/users
 * Get all users with pagination
 */
router.get('/users', adminController.getUsers);

/**
 * PUT /admin/users/:id/status
 * Update user status (activate/suspend)
 */
router.put('/users/:id/status', adminController.updateUserStatus);

/**
 * GET /admin/influencers
 * Get all influencers with pagination
 */
router.get('/influencers', adminController.getInfluencers);

/**
 * GET /admin/influencer-applications
 * Get pending influencer applications
 */
router.get('/influencer-applications', adminController.getInfluencers);

/**
 * PUT /admin/influencer-applications/:id/approve
 * Approve influencer application
 */
router.put('/influencer-applications/:id/approve', adminController.approveInfluencer);

/**
 * PUT /admin/influencer-applications/:id/reject
 * Reject influencer application
 */
router.put('/influencer-applications/:id/reject', adminController.rejectInfluencer);

/**
 * GET /admin/payments
 * Get all payments with pagination
 */
router.get('/payments', adminPaymentController.getAll);

/**
 * GET /admin/payments/:id
 * Get payment detail (admin)
 */
router.get('/payments/:id', adminPaymentController.getDetail);

/**
 * POST /admin/payments/:id/refund
 * Process manual refund
 */
router.post('/payments/:id/refund', adminPaymentController.refund);

/**
 * GET /admin/settlements
 * Get all settlements with pagination
 */
router.get('/settlements', adminSettlementController.getAll);

/**
 * GET /admin/settlements/:id
 * Get settlement detail (admin)
 */
router.get('/settlements/:id', adminSettlementController.getDetail);

/**
 * PUT /admin/settlements/:id/approve
 * Approve settlement
 */
router.put('/settlements/:id/approve', adminSettlementController.approve);

/**
 * PUT /admin/settlements/:id/complete
 * Complete settlement
 */
router.put('/settlements/:id/complete', adminSettlementController.complete);

/**
 * POST /admin/settlements/:id/process
 * Process settlement payout
 */
router.post('/settlements/:id/process', adminController.processSettlement);

/**
 * POST /admin/settlements/calculate
 * Calculate settlement (admin)
 */
router.post('/settlements/calculate', adminSettlementController.calculate);

/**
 * GET /admin/inquiries
 * Get support inquiries with pagination
 */
router.get('/inquiries', adminController.getInquiries);

/**
 * POST /admin/inquiries/:id/respond
 * Respond to an inquiry
 */
router.post('/inquiries/:id/respond', adminController.respondToInquiry);

/**
 * GET /admin/settings/fees
 * Get fee settings
 */
router.get('/settings/fees', adminController.getFeeSettings);

/**
 * PUT /admin/settings/fees
 * Update fee settings
 */
router.put('/settings/fees', adminController.updateFeeSettings);

/**
 * GET /admin/analytics
 * Get analytics data
 */
router.get('/analytics', adminController.getAnalytics);

export default router;
