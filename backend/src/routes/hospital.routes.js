import { Router } from 'express';
import { hospitalController } from '../controllers/hospital.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/nearby', hospitalController.getNearbyHospitals);
router.get('/', hospitalController.getHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.post('/', verifyToken, requireRole('admin'), hospitalController.createHospital);

export default router;
