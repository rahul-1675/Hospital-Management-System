import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/patient', verifyToken, appointmentController.getPatientAppointments);
router.get('/:id', verifyToken, appointmentController.getAppointmentById);
router.patch('/:id/status', verifyToken, appointmentController.updateAppointmentStatus);
router.get('/', verifyToken, appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment); // can be guest or logged-in

export default router;
