"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("../middleware/error.middleware");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const billing_routes_1 = __importDefault(require("../modules/billing/billing.routes"));
const dashboard_routes_1 = __importDefault(require("../modules/dashboard/dashboard.routes"));
const inventory_routes_1 = __importDefault(require("../modules/inventory/inventory.routes"));
const sales_routes_1 = __importDefault(require("../modules/sales/sales.routes"));
const medicine_ai_routes_1 = __importDefault(require("../modules/medicine-ai/medicine-ai.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/billing', billing_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/medicine-ai', medicine_ai_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
