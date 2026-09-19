import { Router } from 'express';
import { specialtyController } from '../controllers/specialty.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', specialtyController.getSpecialties);
router.post('/', verifyToken, requireRole('admin'), specialtyController.createSpecialty);

export default router;
