import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function expertManifest() {
  console.log('\n\n🛡️ [BEYOND_AUTHORIZATION]: Initializing Expert Activation Protocol...\n');
  
  const user = await prisma.user.update({
    where: { email: 'vipulsingh44519@gmail.com' },
    data: {
      emailVerified: new Date(),
    }
  });
  
  if (user) {
    console.log(`✅ [EXPERT_ACTIVATED]: Profile ${user.email} is now AUTHORIZED. 🏙️\n\n`);
  } else {
    console.log('❌ [ACTIVATION_FAILED]: No profile found for this email. 🛡️\n\n');
  }
  
  await prisma.$disconnect();
}

expertManifest();
