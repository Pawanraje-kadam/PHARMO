"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../core/config");
const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, data: null, error: 'Access denied. No active token trace located.' });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = verified;
        return next();
    }
    catch (err) {
        res.clearCookie('token');
        return res.status(401).json({ success: false, data: null, error: 'Session signature invalid or expired.' });
    }
};
exports.requireAuth = requireAuth;
