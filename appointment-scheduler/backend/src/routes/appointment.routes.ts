import { Router } from "express";
import {
  bookAppointment,
  getAppointmentsByEmail,
  cancelAppointment,
} from "../controllers/appointment.controller";
import { verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", bookAppointment);
router.get("/:email", getAppointmentsByEmail);
router.delete("/:id", cancelAppointment); // Allow users to cancel their own appointments

export default router;
