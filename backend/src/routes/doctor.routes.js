import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller.js';

const router = Router();

router.get('/', doctorController.getDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.get('/:id', doctorController.getDoctorById);

export default router;
