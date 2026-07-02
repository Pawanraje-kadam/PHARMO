import { Router } from 'express';
import { checkoutInvoice } from './billing.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { billingLimiter } from '../../middleware/rate-limiter.middleware';

const router = Router();
router.post('/checkout', requireAuth, billingLimiter, checkoutInvoice);

export default router;