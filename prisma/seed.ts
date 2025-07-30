import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()


async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'admin@admybrand.com' },
    update: {},
    create: {
      email: 'admin@admybrand.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  })

  // Replace your existing campaign createMany with this, including createdAt dates
  await prisma.campaign.createMany({
    data: [
      {
        name: 'Summer Sale Campaign',
        clicks: 15420,
        impressions: 234567,
        ctr: 6.57,
        conversions: 892,
        cost: 12500,
        userId: user.id,
        createdAt: new Date('2025-05-01T08:00:00Z'),
      },
      {
        name: 'Winter Promotion',
        clicks: 8932,
        impressions: 156789,
        ctr: 5.69,
        conversions: 445,
        cost: 8900,
        userId: user.id,
        createdAt: new Date('2025-01-10T08:00:00Z'),
      },
      {
        name: 'New Product Launch',
        clicks: 21905,
        impressions: 345120,
        ctr: 6.35,
        conversions: 1400,
        cost: 15800,
        userId: user.id,
        createdAt: new Date('2025-03-12T08:00:00Z'),
      },
      {
        name: 'Spring Awareness Blitz',
        clicks: 11200,
        impressions: 129400,
        ctr: 8.66,
        conversions: 600,
        cost: 8000,
        userId: user.id,
        createdAt: new Date('2025-04-05T08:00:00Z'),
      },
      {
        name: 'Black Friday Max',
        clicks: 32199,
        impressions: 509372,
        ctr: 6.33,
        conversions: 2302,
        cost: 22500,
        userId: user.id,
        createdAt: new Date('2024-11-29T08:00:00Z'),
      },
      // Add more campaigns if you want
    ],
  })

  console.log('Database seeded successfully!')
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
