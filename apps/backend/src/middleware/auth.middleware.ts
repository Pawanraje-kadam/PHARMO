import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../core/config.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'ADMIN' | 'CASHIER';
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, data: null, error: 'Access denied. No active token trace located.' });
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret) as any;
    req.user = verified;
    return next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ success: false, data: null, error: 'Session signature invalid or expired.' });
  }
};