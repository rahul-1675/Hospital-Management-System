import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { verifyToken, requireRole, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', reviewController.getReviews);
router.get('/doctor/:doctorId', reviewController.getDoctorReviews);
router.get('/hospital/:hospitalId', reviewController.getHospitalReviews);

// Patient review creation (supports guests and authenticated patients)
router.post('/', optionalAuth, reviewController.createReview);
router.get('/patient', verifyToken, reviewController.getPatientReviews);

// Admin & Moderation routes
router.patch('/:id/status', verifyToken, requireRole('admin'), reviewController.updateReviewStatus);
router.delete('/:id', verifyToken, reviewController.deleteReview);

export default router;
