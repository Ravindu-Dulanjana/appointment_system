import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAvailableSlots = async (req: Request, res: Response) => {
  const now = new Date();
  const slots = await prisma.appointmentSlot.findMany({
    where: { isBooked: false, dateTime: { gte: now } },
    orderBy: { dateTime: 'asc' },
  });
  res.json(slots);
};

export const createSlot = async (req: Request, res: Response) => {
  const { dateTime } = req.body;
  const slot = await prisma.appointmentSlot.create({ data: { dateTime: new Date(dateTime) } });
  res.json(slot);
};