import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function masterAuthorization() {
  console.log('\n\n🛡️ [SECURITY_SYSTEM]: Re-Initializing Expert Authorities with Encryption...\n');
  
  const hashedPassword = await bcrypt.hash('ExpertPassword123!', 12);

  // 1. Activate Master Admin
  await prisma.user.upsert({
    where: { email: 'master@as400.com' },
    update: { emailVerified: new Date(), role: 'ADMIN' },
    create: {
      email: 'master@as400.com',
      name: 'Master Expert',
      password: hashedPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
      username: 'master'
    }
  });
  console.log('✅ [ADMIN_RESTORED]: master@as400.com is AUTHORIZED and ENCRYPTED.');

  // 2. Create and Activate Main Expert
  const expert = await prisma.user.upsert({
    where: { email: 'vipulsingh44519@gmail.com' },
    update: { 
      emailVerified: new Date(),
      password: hashedPassword 
    },
    create: {
      email: 'vipulsingh44519@gmail.com',
      name: 'Vipul Singh',
      password: hashedPassword,
      emailVerified: new Date(),
      username: 'vipulsingh',
      rank: 'Expert Developer',
      points: 50
    }
  });
  console.log('✅ [EXPERT_RESTORED]: vipulsingh44519@gmail.com is AUTHORIZED and ENCRYPTED.\n\n');
  
  await prisma.$disconnect();
}

masterAuthorization();
