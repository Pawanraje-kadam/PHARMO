import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { config } from '../../core/config';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, data: null, error: 'Username and password fields are required.' });
    }

    const { token, profile } = await AuthService.authenticateUser(username, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000 // 12 Hours
    });

    return res.status(200).json({ success: true, data: profile, error: null });
  } catch (error: any) {
    return res.status(401).json({ success: false, data: null, error: error.message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.status(200).json({ success: true, data: 'Session cleared.', error: null });
};

export const checkSession = (req: any, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated.' });
  return res.status(200).json({ success: true, data: req.user, error: null });
};