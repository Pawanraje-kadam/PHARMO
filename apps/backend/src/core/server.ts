import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../middleware/error.middleware.js';

// Routes imports
import authRoutes from '../modules/auth/auth.routes.js';
import billingRoutes from '../modules/billing/billing.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';
import inventoryRoutes from '../modules/inventory/inventory.routes.js';
import salesRoutes from '../modules/sales/sales.routes.js';
import aiAssistantRoutes from '../modules/medicine-ai/medicine-ai.routes.js';

const app = express();

const envOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim());
const isVercelPreview = (origin: string): boolean =>
  /^https?:\/\/[^/]+\.vercel\.app$/.test(origin);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'http://localhost:5173' || isVercelPreview(origin) || envOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

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