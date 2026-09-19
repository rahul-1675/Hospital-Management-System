import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router = Router();

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/status', adminController.toggleUserStatus);

router.get('/logs', adminController.getLogs);
router.get('/invoices', adminController.getInvoices);
router.patch('/invoices/:id/pay', adminController.markInvoicePaid);
router.patch('/invoices/:id/refund', adminController.refundInvoice);

export default router;
