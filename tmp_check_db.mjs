import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const problems = await prisma.problem.findMany({ include: { testCases: true } });
  console.log(JSON.stringify(problems, null, 2));
}
main().finally(() => prisma.$disconnect());
