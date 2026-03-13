import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const username = process.env.USER_NAME
    const rawPassword = process.env.PASSWORD

    if (!username || !rawPassword) {
      throw new Error('USER_NAME o PASSWORD no están definidos en el .env')
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const admin = await prisma.user.upsert({
      where: { user_name: username },
      update: {},
      create: {
        name: 'David',
        user_name: username,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('✅ Admin creado o ya existente:', admin.user_name)

  } catch (error) {
    console.error('❌ Error creando admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()