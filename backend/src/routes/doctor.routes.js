import { Router } from 'express';
import { doctorController } from '../controllers/doctor.controller.js';

const router = Router();

// Portal Specific Endpoints (must come before /:id)
router.get('/portal/dashboard-stats', doctorController.getPortalDashboardStats);
router.get('/portal/appointments', doctorController.getPortalAppointments);
router.post('/portal/appointments/:id/cancel', doctorController.cancelAppointment);
router.put('/portal/appointments/:id/consultation', doctorController.updateConsultation);
router.get('/portal/patients', doctorController.getPortalPatients);
router.get('/portal/patient-removal-requests', doctorController.getPatientRemovalRequests);
router.post('/portal/patient-removal-requests', doctorController.requestPatientRemoval);
router.get('/portal/records', doctorController.getPortalRecords);
router.post('/portal/records', doctorController.savePortalRecord);
router.get('/portal/profile', doctorController.getDoctorProfile);
router.put('/portal/profile', doctorController.updateDoctorProfile);

// Public Discovery Endpoints
router.get('/', doctorController.getDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.get('/:id', doctorController.getDoctorById);

export default router;

