import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {

  const password = await bcrypt.hash("T123456w", 10)

  await prisma.user.upsert({
    where: { user_name: "admin" },
    update: {},
    create: {
      name: "David",
      user_name: "DCOUOH",
      password: password,
      role: "ADMIN",
    },
  })

}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })