import { Router } from 'express';
import {
  bookAppointment,
  getAppointmentsByEmail,
  cancelAppointment
} from '../controllers/appointment.controller';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', bookAppointment);
router.get('/:email', getAppointmentsByEmail);
router.delete('/:id', verifyAdmin, cancelAppointment); // Admin only

export default router;