import server from './core/server.js';
import { config } from './core/config.js';
import { prisma } from './core/database.js';

const startServer = async () => {
  try {
    // Confirm persistent database node readiness handshake before initializing sockets
    await prisma.$connect();
    console.log('📦 [POSTGRES ENGINE]: Database transmission pipe established.');

    server.listen(config.port, () => {
      console.log(`🚀 [PHARMO CORE RUNNING]: Server listening on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    console.error('❌ [FATAL BOOT ENGINE EXCEPTION]: Initial transmission line collapsed:', error);
    process.exit(1);
  }
};

startServer();