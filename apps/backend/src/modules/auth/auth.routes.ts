import { Router } from 'express';
import { login, logout, checkSession } from './auth.controller';
import { loginLimiter } from '../../middleware/rate-limiter.middleware';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, checkSession);

export default router;