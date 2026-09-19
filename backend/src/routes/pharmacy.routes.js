import { Router } from 'express';
import { pharmacyController } from '../controllers/pharmacy.controller.js';

const router = Router();

router.get('/inventory', pharmacyController.getInventory);
router.post('/inventory', pharmacyController.addMedicine);
router.put('/inventory/:id', pharmacyController.updateMedicine);
router.delete('/inventory/:id', pharmacyController.deleteMedicine);

router.get('/prescriptions', pharmacyController.getPrescriptions);
router.patch('/prescriptions/:id/dispense', pharmacyController.dispensePrescription);

export default router;
