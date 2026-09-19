import { Router } from 'express';
import { feedbackController } from '../controllers/feedback.controller.js';

const router = Router();

router.get('/', feedbackController.getFeedback);
router.post('/', feedbackController.submitFeedback);

export default router;
