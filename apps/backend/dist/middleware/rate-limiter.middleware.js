"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, data: null, error: 'Too many authentication attempts. Terminal locked for 15 minutes.' }
});
exports.billingLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 1000,
    max: 1,
    message: { success: false, data: null, error: 'Duplicate transaction processing skipped safely.' }
});
