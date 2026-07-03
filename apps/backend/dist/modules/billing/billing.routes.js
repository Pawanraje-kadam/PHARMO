"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_controller_1 = require("./billing.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limiter_middleware_1 = require("../../middleware/rate-limiter.middleware");
const router = (0, express_1.Router)();
router.post('/checkout', auth_middleware_1.requireAuth, rate_limiter_middleware_1.billingLimiter, billing_controller_1.checkoutInvoice);
exports.default = router;
