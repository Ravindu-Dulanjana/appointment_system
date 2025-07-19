import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookAppointment = async (req: Request, res: Response) => {
  const { name, email, slotId } = req.body;
  const slot = await prisma.appointmentSlot.findUnique({ where: { id: slotId } });

  if (!slot || slot.isBooked) {
    return res.status(400).json({ message: 'Slot is already booked or does not exist' });
  }

  const appointment = await prisma.appointment.create({
    data: { name, email, slotId },
  });

  await prisma.appointmentSlot.update({
    where: { id: slotId },
    data: { isBooked: true },
  });

  res.json(appointment);
};

export const getAppointmentsByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  const appointments = await prisma.appointment.findMany({
    where: { email },
    include: { slot: true },
    orderBy: { slot: { dateTime: 'asc' } }
  });
  res.json(appointments);
};

export const cancelAppointment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const appointment = await prisma.appointment.findUnique({ where: { id } });

  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  await prisma.appointmentSlot.update({
    where: { id: appointment.slotId },
    data: { isBooked: false },
  });

  await prisma.appointment.delete({ where: { id } });

  res.json({ message: 'Appointment canceled' });
};