import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /users/terms-agreement
 * Save terms agreement
 */
router.post('/terms-agreement', authenticate, (req, res) => {
  userController.saveTermsAgreement(req as AuthenticatedRequest, res);
});

/**
 * GET /users/check-nickname
 * Check if nickname is available
 */
router.get('/check-nickname', (req, res) => {
  userController.checkNickname(req as AuthenticatedRequest, res);
});

/**
 * POST /users/profile
 * Create initial profile
 */
router.post('/profile', authenticate, (req, res) => {
  userController.createProfile(req as AuthenticatedRequest, res);
});

/**
 * GET /users/me
 * Get current user profile
 */
router.get('/me', authenticate, (req, res) => {
  userController.getProfile(req as AuthenticatedRequest, res);
});

/**
 * PUT /users/me
 * Update current user profile
 */
router.put('/me', authenticate, (req, res) => {
  userController.updateProfile(req as AuthenticatedRequest, res);
});

/**
 * DELETE /users/me
 * Delete user account
 */
router.delete('/me', authenticate, (req, res) => {
  userController.deleteAccount(req as AuthenticatedRequest, res);
});

/**
 * PUT /users/me/notifications
 * Update notification settings
 */
router.put('/me/notifications', authenticate, (req, res) => {
  userController.updateNotificationSettings(req as AuthenticatedRequest, res);
});

/**
 * GET /users/me/applications
 * Get user's applications
 */
router.get('/me/applications', authenticate, (req, res) => {
  userController.getApplications(req as AuthenticatedRequest, res);
});

/**
 * GET /users/me/travels
 * Get user's active travels
 */
router.get('/me/travels', authenticate, (req, res) => {
  userController.getActiveTravels(req as AuthenticatedRequest, res);
});

/**
 * GET /users/me/notifications
 * Get user's notifications
 */
router.get('/me/notifications', authenticate, (req, res) => {
  userController.getNotifications(req as AuthenticatedRequest, res);
});

/**
 * PUT /users/notifications/:id/read
 * Mark notification as read
 */
router.put('/notifications/:id/read', authenticate, (req, res) => {
  userController.markNotificationRead(req as AuthenticatedRequest, res);
});

/**
 * PUT /users/notifications/read-all
 * Mark all notifications as read
 */
router.put('/notifications/read-all', authenticate, (req, res) => {
  userController.markAllNotificationsRead(req as AuthenticatedRequest, res);
});

export default router;
