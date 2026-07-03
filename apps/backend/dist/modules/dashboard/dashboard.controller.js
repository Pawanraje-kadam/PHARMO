"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlertsRegistry = exports.getSummaryMetrics = void 0;
const dashboard_service_1 = require("./dashboard.service");
const getSummaryMetrics = async (_req, res) => {
    const data = await dashboard_service_1.DashboardService.getSummary();
    res.json({ success: true, data, error: null });
};
exports.getSummaryMetrics = getSummaryMetrics;
const getAlertsRegistry = async (_req, res) => {
    const data = await dashboard_service_1.DashboardService.getAlerts();
    res.json({ success: true, data, error: null });
};
exports.getAlertsRegistry = getAlertsRegistry;
