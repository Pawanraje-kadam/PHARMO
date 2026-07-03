"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicine_ai_controller_1 = require("./medicine-ai.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/analyze', auth_middleware_1.requireAuth, medicine_ai_controller_1.analyzePatientSymptoms);
exports.default = router;
