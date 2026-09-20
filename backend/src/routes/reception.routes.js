import { Router } from 'express';
import { receptionController } from '../controllers/reception.controller.js';

const router = Router();

router.get('/overview-stats', receptionController.getOverviewStats);
router.get('/doctors', receptionController.getDoctors);

router.get('/appointments', receptionController.getAppointments);
router.post('/appointments', receptionController.createAppointment);
router.put('/appointments/:id', receptionController.updateAppointment);
router.delete('/appointments/:id', receptionController.cancelAppointment);

router.get('/queue', receptionController.getQueueState);
router.put('/queue', receptionController.updateQueueState);

router.get('/invoices', receptionController.getInvoices);
router.post('/invoices', receptionController.createInvoice);

router.get('/patients/pending', receptionController.getPendingPatients);
router.patch('/patients/:id/approve', receptionController.approvePatient);
router.patch('/patients/:id/reject', receptionController.rejectPatient);

export default router;

