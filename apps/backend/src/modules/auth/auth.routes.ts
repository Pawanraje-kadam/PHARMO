import { Router } from 'express';
import { login, logout, checkSession } from './auth.controller.js';
import { loginLimiter } from '../../middleware/rate-limiter.middleware.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, checkSession);

export default router;