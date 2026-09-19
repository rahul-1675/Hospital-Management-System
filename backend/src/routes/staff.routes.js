import { Router } from 'express';
import { staffController } from '../controllers/staff.controller.js';

const router = Router();

router.get('/members', staffController.getStaffMembers);
router.patch('/members/:id/status', staffController.updateStaffDutyStatus);
router.get('/tasks', staffController.getTasks);
router.post('/tasks', staffController.createTask);
router.patch('/tasks/:id/status', staffController.updateTaskStatus);

export default router;
