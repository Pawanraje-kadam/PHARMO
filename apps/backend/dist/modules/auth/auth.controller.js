"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = exports.logout = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const config_1 = require("../../core/config");
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, data: null, error: 'Username and password fields are required.' });
        }
        const { token, profile } = await auth_service_1.AuthService.authenticateUser(username, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === 'production',
            sameSite: 'lax',
            maxAge: 12 * 60 * 60 * 1000
        });
        return res.status(200).json({ success: true, data: profile, error: null });
    }
    catch (error) {
        return res.status(401).json({ success: false, data: null, error: error.message });
    }
};
exports.login = login;
const logout = (_req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ success: true, data: 'Session cleared.', error: null });
};
exports.logout = logout;
const checkSession = (req, res) => {
    if (!req.user)
        return res.status(401).json({ success: false, data: null, error: 'Unauthenticated.' });
    return res.status(200).json({ success: true, data: req.user, error: null });
};
exports.checkSession = checkSession;
