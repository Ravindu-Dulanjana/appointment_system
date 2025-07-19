import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all slots (both available and booked) for display purposes
export const getAllSlots = async (req: Request, res: Response) => {
  const now = new Date();
  const slots = await prisma.appointmentSlot.findMany({
    where: { dateTime: { gte: now } },
    include: { booking: true }, // Include appointment details for booked slots
    orderBy: { dateTime: "asc" },
  });
  res.json(slots);
};

// Get only available slots (for booking purposes)
export const getAvailableSlots = async (req: Request, res: Response) => {
  const now = new Date();
  const slots = await prisma.appointmentSlot.findMany({
    where: { isBooked: false, dateTime: { gte: now } },
    orderBy: { dateTime: "asc" },
  });
  res.json(slots);
};

export const createSlot = async (req: Request, res: Response) => {
  const { dateTime } = req.body;
  try {
    const slot = await prisma.appointmentSlot.create({
      data: { dateTime: new Date(dateTime) },
    });
    res.json(slot);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "A slot already exists for this date and time" });
    }
    res.status(500).json({ message: "Failed to create slot" });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { dateTime } = req.body;

  try {
    const existingSlot = await prisma.appointmentSlot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!existingSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if the new dateTime already exists (excluding current slot)
    const duplicateSlot = await prisma.appointmentSlot.findFirst({
      where: {
        dateTime: new Date(dateTime),
        id: { not: id },
      },
    });

    if (duplicateSlot) {
      return res
        .status(400)
        .json({ message: "A slot already exists for this date and time" });
    }

    const updatedSlot = await prisma.appointmentSlot.update({
      where: { id },
      data: { dateTime: new Date(dateTime) },
      include: { booking: true },
    });

    res.json(updatedSlot);
  } catch (error: any) {
    console.error("Update slot error:", error);
    res.status(500).json({ message: "Failed to update slot" });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const slot = await prisma.appointmentSlot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        message: "Cannot delete a booked slot. Cancel the appointment first.",
      });
    }

    await prisma.appointmentSlot.delete({ where: { id } });
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete slot" });
  }
};
