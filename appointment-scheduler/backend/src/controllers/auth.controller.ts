import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  res.json({ token });
};