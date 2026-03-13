import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('T123456w', 10);

  await prisma.user.upsert({
    where: { user_name: 'DCOUOH' },
    update: {},
    create: {
      name: 'David',
      user_name: 'DCOUOH',
      password: password,
      role: 'ADMIN',
    },
  });
  console.log('Admin creado');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
