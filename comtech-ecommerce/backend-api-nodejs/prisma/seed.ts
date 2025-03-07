import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ฟังก์ชันสำหรับแฮชรหัสผ่าน
  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  // ลบข้อมูลเดิมทั้งหมด (ถ้าต้องการ)
  await prisma.user.deleteMany({});

  // สร้าง users
  const users = [
    {
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: Role.ADMIN,
    },
    {
      email: 'editor@example.com',
      password: await hashPassword('editor123'),
      role: Role.EDITOR,
    },
  ];

  // เพิ่มข้อมูลผู้ใช้
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {}, // ถ้ามีอยู่แล้วให้ไม่ทำอะไร
      create: user, // ถ้ายังไม่มีให้สร้างใหม่
    });
  }

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });