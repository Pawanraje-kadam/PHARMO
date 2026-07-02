import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export const getSummaryMetrics = async (_req: Request, res: Response) => {
  const data = await DashboardService.getSummary();
  res.json({ success: true, data, error: null });
};

export const getAlertsRegistry = async (_req: Request, res: Response) => {
  const data = await DashboardService.getAlerts();
  res.json({ success: true, data, error: null });
};