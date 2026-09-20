import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller.js';

const router = Router();

// Portal Specific Endpoints (must come before /:id)
router.get('/portal/dashboard-stats', doctorController.getPortalDashboardStats);
router.get('/portal/appointments', doctorController.getPortalAppointments);
router.put('/portal/appointments/:id/consultation', doctorController.updateConsultation);
router.get('/portal/patients', doctorController.getPortalPatients);
router.get('/portal/records', doctorController.getPortalRecords);
router.post('/portal/records', doctorController.savePortalRecord);

// Public Discovery Endpoints
router.get('/', doctorController.getDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.get('/:id', doctorController.getDoctorById);

export default router;

