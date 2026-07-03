"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./core/server"));
const config_1 = require("./core/config");
const database_1 = require("./core/database");
const startServer = async () => {
    try {
        await database_1.prisma.$connect();
        console.log('📦 [POSTGRES ENGINE]: Database transmission pipe established.');
        server_1.default.listen(config_1.config.port, () => {
            console.log(`🚀 [PHARMO CORE RUNNING]: Port address live context -> HTTP://LOCALHOST:${config_1.config.port}`);
        });
    }
    catch (error) {
        console.error('❌ [FATAL BOOT ENGINE EXCEPTION]: Initial transmission line collapsed:', error);
        process.exit(1);
    }
};
startServer();
