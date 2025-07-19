import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};