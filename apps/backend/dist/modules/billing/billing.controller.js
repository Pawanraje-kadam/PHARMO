"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutInvoice = void 0;
const billing_service_1 = require("./billing.service");
const checkoutInvoice = async (req, res) => {
    try {
        const { items } = req.body;
        const cashierId = req.user?.id;
        if (!cashierId)
            return res.status(401).json({ success: false, data: null, error: 'Unauthorized.' });
        if (!items || !Array.isArray(items))
            return res.status(400).json({ success: false, data: null, error: 'Invalid items array.' });
        const completedInvoice = await billing_service_1.BillingService.processCheckout(cashierId, items);
        return res.status(201).json({ success: true, data: completedInvoice, error: null });
    }
    catch (error) {
        return res.status(400).json({ success: false, data: null, error: error.message });
    }
};
exports.checkoutInvoice = checkoutInvoice;
