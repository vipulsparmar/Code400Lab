import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await hash('ExpertPassword123!', 12);

  // Create initial user
  const user = await prisma.user.upsert({
    where: { email: 'master@as400.com' },
    update: { password },
    create: {
      email: 'master@as400.com',
      name: 'IBM i Veteran',
      username: 'as400_master',
      password,
      points: 1250,
      rank: 'Expert Programmer',
      solved: 4,
      streak: 1,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log(`User created: ${user.email}`);

  // Create some problems
  const problems = [
    {
      title: 'RPG: Basic Addition Protocol',
      slug: 'rpg-basic-add',
      difficulty: 'Easy',
      language: 'RPGLE',
      category: 'Arithmetic',
      description: 'Create an RPGLE procedure that takes two integers and returns their sum. Focus on basic variable declaration and return logic.',
      inputFormat: 'Two integers (int1, int2)',
      outputFormat: 'Integer (sum)',
      sampleInput: '10, 20',
      sampleOutput: '30',
      starterCode: `**FREE
dcl-proc AddNumbers export;
  dcl-pi *n int(10);
    val1 int(10) const;
    val2 int(10) const;
  end-pi;

  // Your logic here
  return 0;
end-proc;`,
      tags: 'rpgle,math,easy',
    },
    {
      title: 'CL: Name Concatenation',
      slug: 'cl-name-join',
      difficulty: 'Easy',
      language: 'CLLE',
      category: 'String Handling',
      description: 'Write a CL program that takes a First Name and a Last Name as variables and joins them with a space between them into a full name variable.',
      inputFormat: 'First(10), Last(10)',
      outputFormat: 'Full(21)',
      sampleInput: "'John', 'Doe'",
      sampleOutput: "'John Doe'",
      starterCode: `PGM PARM(&FIRST &LAST)
  DCL VAR(&FIRST) TYPE(*CHAR) LEN(10)
  DCL VAR(&LAST) TYPE(*CHAR) LEN(10)
  DCL VAR(&FULL) TYPE(*CHAR) LEN(21)
  
  /* Your code here */
  
ENDPGM`,
      tags: 'clle,strings,basics',
    },
    {
      title: 'RPG: String Integrity Reverse',
      slug: 'rpg-string-rev',
      difficulty: 'Easy',
      language: 'RPGLE',
      category: 'String Operations',
      description: 'Implement a procedure to reverse a 10-character string. For example, "ABCDE" should return "EDCBA".',
      inputFormat: 'String(10)',
      outputFormat: 'String(10)',
      sampleInput: "'RPGLE'",
      sampleOutput: "'ELGPR'",
      starterCode: `**FREE
dcl-proc ReverseString export;
  dcl-pi *n char(10);
    inputVal char(10) const;
  end-pi;

  dcl-s outputVal char(10);
  // Your logic here
  return outputVal;
end-proc;`,
      tags: 'rpgle,strings,reverse',
    },
    {
      title: 'CL: Library Sentinel',
      slug: 'cl-lib-check',
      difficulty: 'Easy',
      language: 'CLLE',
      category: 'System Management',
      description: 'Create a CL tool that checks if a specific library exists on the system using CHKOBJ. Return "FOUND" if it exists, and "MISSING" if it does not.',
      inputFormat: 'Library Name(10)',
      outputFormat: 'Status(10)',
      sampleInput: "'MYLIB'",
      sampleOutput: "'FOUND'",
      starterCode: `PGM PARM(&LIBNAME)
  DCL VAR(&LIBNAME) TYPE(*CHAR) LEN(10)
  DCL VAR(&STATUS) TYPE(*CHAR) LEN(10)
  
  /* Your code here */
  
ENDPGM`,
      tags: 'clle,system,check',
    },
    {
      title: 'RPG: Score Aggregator',
      slug: 'rpg-score-sum',
      difficulty: 'Easy',
      language: 'RPGLE',
      category: 'Arrays',
      description: 'You have an array of 5 test scores. Write a procedure to calculate the total sum of these scores.',
      inputFormat: 'Array of 5 integers',
      outputFormat: 'Integer (Total)',
      sampleInput: '[80, 90, 70, 85, 95]',
      sampleOutput: '420',
      starterCode: `**FREE
dcl-proc SumScores export;
  dcl-pi *n int(10);
    scores int(10) dim(5) const;
  end-pi;

  dcl-s total int(10) inz(0);
  // Your logic here
  return total;
end-proc;`,
      tags: 'rpgle,arrays,loops',
    },
    {
      title: 'CL: Signal Loop Master',
      slug: 'cl-loop-counter',
      difficulty: 'Easy',
      language: 'CLLE',
      category: 'Logic Flow',
      description: 'Write a CL program that uses a DO-WHILE loop to increment a counter from 1 to 5. Once it reaches 5, send a completion message.',
      inputFormat: 'None',
      outputFormat: 'Final Counter Value',
      sampleInput: 'Start',
      sampleOutput: '5',
      starterCode: `PGM
  DCL VAR(&COUNT) TYPE(*INT) LEN(4) VALUE(0)
  
  /* Your loop here */
  
ENDPGM`,
      tags: 'clle,loops,logic',
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
