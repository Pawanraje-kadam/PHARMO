import server from './core/server';
import { config } from './core/config';
import { prisma } from './core/database';

const startServer = async () => {
  try {
    // Confirm persistent database node readiness handshake before initializing sockets
    await prisma.$connect();
    console.log('📦 [POSTGRES ENGINE]: Database transmission pipe established.');

    server.listen(config.port, () => {
      console.log(`🚀 [PHARMO CORE RUNNING]: Port address live context -> HTTP://LOCALHOST:${config.port}`);
    });
  } catch (error) {
    console.error('❌ [FATAL BOOT ENGINE EXCEPTION]: Initial transmission line collapsed:', error);
    process.exit(1);
  }
};

startServer();