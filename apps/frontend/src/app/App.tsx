import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Structural Layout Layouts & Guards
import { MainLayout } from '../core/layouts/MainLayout';
import { ProtectedRoute } from '../core/components/ProtectedRoute';

// View Orchestrators
import { LoginView } from '../features/auth/views/LoginView';
import { DashboardView } from '../features/dashboard/views/DashboardView';
import { BillingDashboardView } from '../features/billing/views/BillingDashboardView';
import { InventoryManagerView } from '../features/inventory/views/InventoryManagerView';
import { SalesHistoryView } from '../features/sales/views/SalesHistoryView';
import { AIAssistantView } from '../features/ai-assistant/views/AIAssistantView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unprotected Public Context Route */}
        <Route path="/login" element={<LoginView />} />

        {/* Secure Authenticated System Workspace Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Main Workspace Index redirects straight to Analytics Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="billing" element={<BillingDashboardView />} />
          <Route path="inventory" element={<InventoryManagerView />} />
          <Route path="sales" element={<SalesHistoryView />} />
          <Route path="ai-assistant" element={<AIAssistantView />} />
        </Route>

        {/* Global Catch-all Routing Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};