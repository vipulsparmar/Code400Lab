import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findAllTokens() {
  console.log('\n\n🔍 [VAULT_SCAN]: Searching for all active identity tokens...\n');
  
  const tokens = await prisma.verificationToken.findMany({
    orderBy: { expires: 'desc' },
    take: 5
  });
  
  if (tokens.length > 0) {
    tokens.forEach(t => {
      console.log(`🛡️  EXPERT: ${t.identifier} -> TOKEN: ${t.token} 🏙️`);
    });
  } else {
    console.log('❌ [SCAN_EMPTY]: No active tokens found in the vault. 🛡️\n');
    
    // Check if master@as400.com even exists yet
    const master = await prisma.user.findUnique({
      where: { email: 'master@as400.com' }
    });
    
    if (master) {
      console.log(`💡 [VAULT_HINT]: master@as400.com already exists. Verified Status: ${master.emailVerified ? 'AUTHORIZED' : 'PENDING'}`);
    } else {
      console.log('💡 [VAULT_HINT]: master@as400.com does not exist in the registry yet.');
    }
  }
  
  await prisma.$disconnect();
}

findAllTokens();
