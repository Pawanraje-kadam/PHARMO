import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PHARMO admin user...');

  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('Admin@123', saltRounds);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password_hash: adminPasswordHash,
      role: Role.ADMIN,
      is_active: true,
    },
    create: {
      username: 'admin',
      password_hash: adminPasswordHash,
      role: Role.ADMIN,
      is_active: true,
    },
  });

  console.log('✅ Admin user seeded successfully.');
  console.log('');
  console.log('Username: admin');
  console.log('Password: Admin@123');
  console.log('Role: ADMIN');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
