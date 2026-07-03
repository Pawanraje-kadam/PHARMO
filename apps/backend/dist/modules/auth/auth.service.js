"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../core/database");
const config_1 = require("../../core/config");
class AuthService {
    static async authenticateUser(username, password_text) {
        const user = await database_1.prisma.user.findUnique({ where: { username } });
        if (!user || !user.is_active) {
            throw new Error('Invalid credentials or inactive account configuration.');
        }
        const passwordMatches = await bcrypt_1.default.compare(password_text, user.password_hash);
        if (!passwordMatches) {
            throw new Error('Invalid credentials or inactive account configuration.');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, config_1.config.jwtSecret, { expiresIn: '12h' });
        return {
            token,
            profile: { id: user.id, username: user.username, role: user.role }
        };
    }
}
exports.AuthService = AuthService;
