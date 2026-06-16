const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  await prisma.todo.createMany({
    data: [
      { title: 'Seed todo 1', done: false },
      { title: 'Seed todo 2', done: true }
    ],
    skipDuplicates: true
  });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
