import { Router } from 'express';
import { createSlot, getAvailableSlots } from '../controllers/slot.contrller';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAvailableSlots); // Public
router.post('/', verifyAdmin, createSlot); // Admin only

export default router;