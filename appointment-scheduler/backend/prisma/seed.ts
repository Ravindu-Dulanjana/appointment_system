import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    for (let hour = 8; hour < 18; hour += 2) {
      const slot = new Date(date);
      slot.setHours(hour);
      await prisma.appointmentSlot.upsert({
        where: { dateTime: slot },
        update: {},
        create: { dateTime: slot },
      });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
