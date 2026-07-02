import { Router } from 'express';
import { getSummaryMetrics, getAlertsRegistry } from './dashboard.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/summary', getSummaryMetrics);
router.get('/alerts', getAlertsRegistry);

export default router;