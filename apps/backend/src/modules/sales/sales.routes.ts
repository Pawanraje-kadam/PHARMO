import { Router } from 'express';
import { getSalesHistory } from './sales.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireAuth, getSalesHistory);

export default router;