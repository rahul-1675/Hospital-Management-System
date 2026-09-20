import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router = Router();

router.get('/overview-stats', adminController.getOverviewStats);
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.patch('/users/:id/approve', adminController.approveUser);
router.patch('/users/:id/reject', adminController.rejectUser);

router.get('/logs', adminController.getLogs);
router.delete('/logs', adminController.clearLogs);

router.get('/invoices', adminController.getInvoices);
router.delete('/invoices/:id', adminController.deleteInvoice);
router.patch('/invoices/:id/pay', adminController.markInvoicePaid);
router.patch('/invoices/:id/refund', adminController.refundInvoice);

router.delete('/appointments/:id', adminController.deleteAppointment);
router.get('/patient-removal-requests', adminController.getPatientRemovalRequests);
router.patch('/patient-removal-requests/:id/approve', adminController.approvePatientRemoval);
router.patch('/patient-removal-requests/:id/reject', adminController.rejectPatientRemoval);
router.post('/purge-data', adminController.purgeData);

router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
