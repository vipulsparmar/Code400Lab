import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function diagnostic() {
  console.log('\n\n🔍 [VAULT_DIAGNOSTIC]: Auditing Database Engine Properties...\n');
  
  const props = Object.keys(prisma);
  console.log('Available Protocols:', props.join(', '));
  
  // Attempt raw table check
  try {
     const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
     console.log('\n📦 [DATA_STRUCTURE]: Existing Tables in Vault:', JSON.stringify(tables));
  } catch (err) {
     console.error('Raw query error:', err);
  }

  await prisma.$disconnect();
}

diagnostic();
