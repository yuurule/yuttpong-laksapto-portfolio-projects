import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const transaction = await prisma.$transaction(async tx => {

      const hashPassword = async (password: string): Promise<string> => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
      };

      await tx.user.deleteMany({});

      const users = [
        {
          email: 'admin@example.com',
          password: await hashPassword('admin123'),
          displayName: 'Webadmin',
          role: Role.ADMIN,
        },
        {
          email: 'editor@example.com',
          password: await hashPassword('editor123'),
          displayName: 'Test Editor',
          role: Role.EDITOR,
        },
        {
          email: 'author@example.com',
          password: await hashPassword('author123'),
          displayName: 'Test Author',
          role: Role.AUTHOR,
        },
      ];

      for (const user of users) {
        await tx.user.upsert({
          where: { email: user.email },
          update: {}, // ถ้ามีอยู่แล้วให้ไม่ทำอะไร
          create: user, // ถ้ายังไม่มีให้สร้างใหม่
        });
      }

      const brands = ["Asus", "Acer", "Dell", "Lenovo", "HP", "MSI", "Microsoft"];
      for(let brand of brands) {
        await tx.brand.create({
          data: {
            name: brand,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      const categories = ["Work", "Gaming", "Student", "Graphic"];
      for(let category of categories) {
        await tx.category.create({
          data: {
            name: category,
            description: 'Notebook for' + category,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      const tags = ["Hi-end", "Slim", "Performance", "Low price"];
      for(let tag of tags) {
        await tx.tag.create({
          data: {
            name: tag,
            createdBy: { connect: { id: 1 } }
          }
        });
      }
    });
  }
  catch(error) {
    console.error('Transaction failed:', error);
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