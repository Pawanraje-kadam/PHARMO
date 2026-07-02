import { Router } from 'express';
import { getSalesHistory } from './sales.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
router.get('/', requireAuth, getSalesHistory);

export default router;