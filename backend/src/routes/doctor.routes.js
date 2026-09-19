import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller.js';

const router = Router();

router.get('/appointments', doctorController.getDoctorAppointments);
router.get('/queue/:doctorName', doctorController.getDoctorQueue);
router.post('/prescriptions', doctorController.createPrescription);

export default router;
