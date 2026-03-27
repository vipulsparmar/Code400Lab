import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function masterManifest() {
  console.log('\n\n🛡️ [BEYOND_AUTHORIZATION]: Initializing Master Protocol...\n');
  
  const user = await prisma.user.update({
    where: { email: 'master@as400.com' },
    data: {
      emailVerified: new Date(),
      role: 'ADMIN'
    }
  });
  
  if (user) {
    console.log(`✅ [MASTER_ACTIVATED]: Profile ${user.email} is now AUTHORIZED as COMMANDER. 🏙️\n\n`);
  } else {
    console.log('❌ [ACTIVATION_FAILED]: master@as400.com not found in the manifest. 🛡️\n\n');
  }
  
  await prisma.$disconnect();
}

masterManifest();
