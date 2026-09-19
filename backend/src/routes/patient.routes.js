import { Router } from 'express';
import { patientController } from '../controllers/patient.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);
router.get('/dashboard', patientController.getDashboard);
router.post('/save-hospital', patientController.toggleSaveHospital);
router.post('/save-doctor', patientController.toggleSaveDoctor);
router.patch('/notifications/:id/read', patientController.markNotificationRead);

export default router;
