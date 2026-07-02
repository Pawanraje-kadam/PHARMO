import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../middleware/error.middleware';

// Routes imports
import authRoutes from '../modules/auth/auth.routes';
import billingRoutes from '../modules/billing/billing.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';
import salesRoutes from '../modules/sales/sales.routes';
import aiAssistantRoutes from '../modules/medicine-ai/medicine-ai.routes';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Base Route Allocation
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/medicine-ai', aiAssistantRoutes);

// Global Error Catch Engine
app.use(errorHandler);

export default app;