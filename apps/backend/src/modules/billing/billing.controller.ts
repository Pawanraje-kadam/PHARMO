import { Response } from 'express';
import { BillingService } from './billing.service.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export const checkoutInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    const cashierId = req.user?.id;

    if (!cashierId) return res.status(401).json({ success: false, data: null, error: 'Unauthorized.' });
    if (!items || !Array.isArray(items)) return res.status(400).json({ success: false, data: null, error: 'Invalid items array.' });

    const completedInvoice = await BillingService.processCheckout(cashierId, items);
    return res.status(201).json({ success: true, data: completedInvoice, error: null });
  } catch (error: any) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
};