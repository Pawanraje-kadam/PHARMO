import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service.js';

export const getSummaryMetrics = async (_req: Request, res: Response) => {
  try {
    const data = await DashboardService.getSummary();
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const getAlertsRegistry = async (_req: Request, res: Response) => {
  try {
    const data = await DashboardService.getAlerts();
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};
