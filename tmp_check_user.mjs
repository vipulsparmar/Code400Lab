import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
  console.log('\n\n🔍 [USER_DIAGNOSTIC]: Auditing Registry for vipulsingh44519@gmail.com...\n');
  
  const user = await prisma.user.findUnique({
    where: { email: 'vipulsingh44519@gmail.com' }
  });
  
  if (user) {
    console.log(`✅ [USER_FOUND]: Status: ${user.emailVerified ? 'AUTHORIZED' : 'PENDING'} 🏙️`);
    
    // Check for tokens
    const tokens = await prisma.verificationToken.findMany({
      where: { identifier: 'vipulsingh44519@gmail.com' }
    });
    console.log(`🛡️ [TOKEN_COUNT]: Found ${tokens.length} active identity tokens in vault.`);
    if (tokens.length > 0) {
      console.log(`🗝️ [ACTIVE_TOKEN]: Latest code is ${tokens[0].token}`);
    }
  } else {
    console.log('❌ [USER_MISSING]: No expert profile found with this email. Please attempt registration again! 🛡️');
    
    // List latest 3 users for help
    const latest = await prisma.user.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    console.log('\n📜 [LATEST_REGISTRY]:', latest.map(u => u.email).join(', '));
  }

  await prisma.$disconnect();
}

checkUser();
