import { Router } from "express";
import {
  createSlot,
  getAvailableSlots,
  getAllSlots,
  deleteSlot,
  updateSlot,
} from "../controllers/slot.contrller";
import { verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/all", getAllSlots); // Get all slots (available + booked)
router.get("/", getAvailableSlots); // Get only available slots
router.post("/", verifyAdmin, createSlot); // Admin only - create slot
router.put("/:id", verifyAdmin, updateSlot); // Admin only - update slot
router.delete("/:id", verifyAdmin, deleteSlot); // Admin only - delete slot

export default router;
