"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error('💥 [SYSTEM CRASH HOOK]:', err.stack || err.message || err);
    res.status(err.status || 500).json({
        success: false,
        data: null,
        error: err.message || 'Fatal background operation loop trace failure.'
    });
};
exports.errorHandler = errorHandler;
