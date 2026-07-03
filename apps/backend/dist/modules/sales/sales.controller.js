"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesHistory = void 0;
const sales_service_1 = require("./sales.service");
const getSalesHistory = async (req, res) => {
    try {
        const date = req.query.date;
        const records = await sales_service_1.SalesService.getHistory(date);
        res.json({ success: true, data: records, error: null });
    }
    catch (error) {
        res.status(500).json({ success: false, data: null, error: error.message });
    }
};
exports.getSalesHistory = getSalesHistory;
