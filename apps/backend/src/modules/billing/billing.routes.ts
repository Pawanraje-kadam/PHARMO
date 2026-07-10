import { Router } from 'express';
import { checkoutInvoice } from './billing.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { billingLimiter } from '../../middleware/rate-limiter.middleware.js';

const router = Router();
router.post('/checkout', requireAuth, billingLimiter, checkoutInvoice);

export default router;