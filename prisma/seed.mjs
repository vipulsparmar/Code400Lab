import 'dotenv/config';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();



async function main() {
  console.log('Seeding database...');

  // Create initial user
  const user = await prisma.user.upsert({
    where: { username: 'as400_master' },
    update: {},
    create: {
      username: 'as400_master',
      displayName: 'IBM i Veteran',
      points: 1250,
      rank: 'Senior Developer',
      solved: 42,
    },
  });

  // Create some problems
  const problems = [
    {
      title: 'String to Numeric Conversion',
      slug: 'str-to-num',
      difficulty: 'Easy',
      language: 'RPGLE',
      category: 'String Operations',
      description: 'Convert a character string containing a number into a decimal value with 2 precision. Handle negative signs if present at the end of the string (legacy format).',
      inputFormat: 'Varying length character string',
      outputFormat: 'Decimal (15,2)',
      sampleInput: "'123.45'",
      sampleOutput: '123.45',
      starterCode: `**FREE
dcl-proc ConvertToNum export;
  dcl-pi *n packed(15:2);
    inputVal varchar(50) const;
  end-pi;

  // Your code here
  return 0;
end-proc;`,
      tags: 'rpgle,conversion,legacy',
    },
    {
      title: 'Batch Job Error Monitor',
      slug: 'cl-error-monitor',
      difficulty: 'Medium',
      language: 'CLLE',
      category: 'CL Automation',
      description: 'Create a CL program that attempts to copy a file. If the file is locked or missing, send a message to the system operator and terminate gracefully.',
      inputFormat: 'None',
      outputFormat: 'Status Code',
      sampleInput: 'FILE(MYLIB/MYFILE)',
      sampleOutput: 'CPF2817 caught',
      starterCode: `PGM
  DCL VAR(&MSG) TYPE(*CHAR) LEN(50)
  
  /* Your code here */
  
ENDPGM`,
      tags: 'clle,error-handling,automation',
    },
  ];

  for (const p of problems) {
    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        testCases: {
          create: [
            { input: p.sampleInput, expected: p.sampleOutput },
          ],
        },
      },
    });
    console.log(`Created problem: ${problem.title}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
