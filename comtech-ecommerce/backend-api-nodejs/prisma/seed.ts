import { PrismaClient, Role, OrderStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { generateUuidBasedSku } from '../src/libs/utility';

const prisma = new PrismaClient();

async function main() {
  try {
    const transaction = await prisma.$transaction(async tx => {

      const hashPassword = async (password: string): Promise<string> => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
      };

      await tx.user.deleteMany({});
      await tx.customer.deleteMany({});

      // Dummy data
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
      const brands = ["Asus", "Acer", "Dell", "Lenovo", "HP", "MSI", "Microsoft"];
      const categories = ["Work", "Gaming", "Student", "Graphic"];
      const tags = ["Hi-end", "Slim", "Performance", "Low price", "Big screen"];
      const products = [
        {
          userId: 1,
          name: "Asus ROG Flow Z13 GZ302EA-RU087WA Off Black",
          description: "Asus ROG Flow Z13 (GZ302) โน๊ตบุ๊ค AI Gaming ขนาดพกพาที่แรงที่สุด ตัวเครื่องดีไซน์แบบกึ่งโปร่งใส ช่วยให้คุณมองเห็นส่วนประกอบประสิทธิภาพสูงบนเมนบอร์ด มาพร้อมกับฟังก์ชันที่รองรับการใช้งานที่หลากหลาย กับแบตเตอรี่ที่ยาวนานสามารถจัดการงานหรือการเล่นเกมได้แบบลื่นไหล",
          brandId: 1,
          price: 79990,
          categories: [{categoryId: 2}],
          tags: [{tagId: 1}, {tagId: 3}],
          images: [],
          specs: {
            screen_size: "13.4 inch",
            processor: "AMD Ryzen AI MAX+ 395, 3.0GHz Up to 5.1GHz, 16C/32T, 64MB L3 Cache, NPU up to 50TOPS",
            display: "2.5K 2560x1600 @180Hz, WQXGA, IPS, 16:10",
            memory: "32GB",
            storage: "1TB SSD M.2",
            graphic: "AMD Radeon Graphics",
            operating_system: "Windows 11 Home",
            camera: "13MP camera and 5MP IR camera",
            optical_drive: "No",
            connection_ports: "2x USB-C4.0 (DP, Power Delivery), 1x USB3.2, 1x HDMI v2.1, 1x card reader (microSD) (UHS-II)",
            wireless: "Wi-Fi 7 (802.11be) (Triple band) + Bluetooth v5.4",
            battery: "70Wh, 4S1P, 4-Cell Li-ion",
            color: "Off Black",
            dimension: "30.0 x 20.4 x 1.49",
            weight: "1.20 Kg.",
            warranty: "3 Year Onsite service / 1 Year Perfect warranty",
            option: "Keyboard TH/EN / Backlit Chiclet Keyboard 1-Zone RGB / Microsoft Office Home 2024 / Microsoft 365 Basic"
          }
        },
        {
          userId: 1,
          name: "Asus TUF Gaming A16 FA608WV-QT069WF Jaeger Gray",
          description: "Asus TUF Gaming A16 มีคุณสมบัติที่น่าประทับใจ มาพร้อมโปรเซสเซอร์ AMD Ryzen AI 9 HX 370 และNVIDIA GeForce RTX 40 Series จึงเล่นเกมล่าสุดหรือทำให้เวิร์กโฟลว์ของคุณลื่นไหล ไม่สะดุด",
          brandId: 1,
          price: 55990,
          categories: [{categoryId: 2}],
          tags: [{tagId: 1}, {tagId: 3}, {tagId: 5}],
          images: [],
          specs: {
            screen_size: "16.0 inch",
            processor: "AMD Ryzen AI 9 HX 370, 2.0GHz up to 5.1GHz, 12C/24T, 24 MB L3 Cache, AMD Ryzen AI up to 81 TOPs",
            display: "2.5K 2560x1600 @165Hz, WQXGA, IPS, 16:10 aspect ratio, 100% SRGB, Anti-glare display",
            memory: "16GB",
            storage: "1TB SSD M.2",
            graphic: "NVIDIA GeForce RTX 4060 Laptop",
            operating_system: "Windows 11 Home",
            camera: "FHD 1080P IR Camera for Windows Hello",
            optical_drive: "No",
            connection_ports: "1x USB-C4.0 (DP), 1x USB-C3.2 (DP, Power Delivery, G-SYNC), 2x USB3.2, 1x RJ45",
            wireless: "Wi-Fi 6E(802.11ax) (Triple band) 2*2 + Bluetooth v5.3",
            battery: "90Wh, 4S1P, 4-Cell Li-ion",
            color: "Jaeger Gray",
            dimension: "35.4 x 26.9 x 1.79",
            weight: "2.20 Kg.",
            warranty: "2 Year (Onsite Service) / 1 Year (Perfect Warranty)",
            option: "Keyboard TH/EN"
          },
        },
        {
          userId: 1,
          name: "Lenovo Yoga Pro 7 14IMH9-83E2002WTA Luna Grey",
          description: "Lenovo YOGA Pro 7 ให้คุณได้รับประสบการณ์ที่เต็มตา ขอบจอสุดบาง จะดูหนังก็ฟินด้วยภาพสีสันสุดสดใสแบบ 3K ทั้งยังมาพร้อมแพลตฟอร์ม Intel Core Ultra และ NVIDIA  RTX 40 Series ที่จะทำให้ตัวเครื่องพร้อมใช้งานในทุกเวลา",
          brandId: 4,
          price: 57990,
          categories: [{categoryId: 1}, {categoryId: 4}],
          tags: [{tagId: 2}, {tagId: 3}],
          images: [],
          specs: {
            screen_size: "14.5 inch [Touch Screen]",
            processor: "Intel Core Ultra 9 185H, up to 5.1GHz, 16C(6P+8E+2LPE)/22T, 24MB Intel Smart Cache",
            display: "3K 3072x1920 @120Hz, IPS, 400nits, Glossy / Anti-fingerprint, 100% P3, 100% sRGB, Eyesafe, Dolby Vision, Glass, TCON",
            memory: "32GB",
            storage: "1TB SSD M.2",
            graphic: "NVIDIA GeForce RTX 4060 Laptop",
            operating_system: "Windows 11 Home",
            camera: "FHD 1080p + IR with E-shutter, ToF Sensor",
            optical_drive: "No",
            connection_ports: "1x Thunderbolt 4 (DP, Power Delivery), 1x USB-C3.2 (DP, Power Delivery), 1x USB3.2 (Always On), 1x HDMI v2.1, 1x Headphone / microphone combo jack (3.5mm)",
            wireless: "Wi-Fi 6E (802.11ax) 2*2 + Bluetooth v5.3",
            battery: "73Wh",
            color: "Luna Gray",
            dimension: "32.55 x 22.64 x 1.66",
            weight: "1.59 Kg.",
            warranty: "3 Year Premium Care(Onsite) / 3 Year (Accidental Damage Protection)",
            option: "Keyboard TH/EN // Microsoft Office Home & Student 2021"
          },
        },
        {
          userId: 1,
          name: "MSI Titan 18 HX Dragon Edition Norse Myth A2XWJG-286TH Core Black",
          description: "MSI Titan 18 HX Dragon Edition Norse Myth (A2XW) นิยามมาตรฐานใหม่สำหรับโน๊ตบุ๊คเกมมิ่ง ด้วยโปรเซสเซอร์ 285HX รุ่นล่าสุดของ Intel Core Ultra 9 ด้วยรุ่นลิมิเต็ด edition ที่มอบประสิทธิภาพการทำงานที่เหนือชั้นกว่าใคร ด้วยดีไซน์สวยสะดุดตาจากตำนานนอร์สอันประณีต ถือว่าเป็นผลงานชิ้นเอกที่สะสมได้อย่างแท้จริง",
          brandId: 6,
          price: 245990,
          categories: [{categoryId: 2}, {categoryId: 4}],
          tags: [{tagId: 1}, {tagId: 3}, {tagId: 5}],
          images: [],
          specs: {
            screen_size: "18.0 inch",
            processor: "Intel Core Ultra 9 285HX, up to 5.5GHz, 24C(8P+16E)/24T, 36MB",
            display: "UHD+ 3840x2400 @120Hz, IPS, MiniLED, 16:10, 100% DCI-P3",
            memory: "96GB",
            storage: "2TB SSD M.2 + 4TB SSD M.2",
            graphic: "NVIDIA GeForce RTX 5090 Laptop",
            operating_system: "Windows 11 Home",
            camera: "IR FHD type (30fps@1080p) with HDR, 3D Noise Reduction+ (3DNR+)",
            optical_drive: "N/A",
            connection_ports: "2x Thunderbolt 5 (DP, Power Delivery), 3x USB3.2, 1x SD Express Card Reader, 1x HDMI v2.1, 1x RJ45, 1x Mic-in/Headphone-out Combo Jack",
            wireless: "Intel Killer Wi-Fi 7 BE1750 + Bluetooth v5.4",
            battery: "99.9Wh, 4-Cell",
            color: "Core Black",
            dimension: "40.4 x 30.7 x 2.4",
            weight: "3.6 Kg.",
            warranty: "3 Year Warranty (1 Year Global / 2 Year Thailand )",
            option: "Keyboard TH/EN / Cherry Mechanical Per-Key RGB Gaming Keyboard by SteelSeries with Copilot Key, RGB Haptic Touchpad"
          },
        },
      ]
      const campaigns = [
        {
          name: "Back to school",
          description: "Slim & good price notebook for student",
          discount: 20
        },
        {
          name: "Gaming Festival",
          description: "Hi-end notebook with best performance for hardcore gaming",
          discount: 10
        },
      ]
      const productsCampaign = [
        { userId: 1, campaignId: 2, productId: 1 },
        { userId: 1, campaignId: 2, productId: 2 },
        { userId: 1, campaignId: 2, productId: 4 },
        { userId: 1, campaignId: 1, productId: 3 },
      ]
      const customers = [
        {
          email: 'user1@mail.com',
          password: await hashPassword('123456'),
          displayName: 'John2025',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'John',
            lastName: 'Doh'
          }
        },
        {
          email: 'user2@mail.com',
          password: await hashPassword('123456'),
          displayName: 'HelloW',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Elena',
            lastName: 'Gomez'
          }
        },
        {
          email: 'yammy@mail.com',
          password: await hashPassword('123456'),
          displayName: 'Yammy',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Yam',
            lastName: 'Laksapto'
          }
        },
        {
          email: 'xmas@mail.com',
          password: await hashPassword('123456'),
          displayName: 'xMas',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Merry',
            lastName: 'Christmas'
          }
        },
      ];

      for (const user of users) {
        await tx.user.upsert({
          where: { email: user.email },
          update: {}, // ถ้ามีอยู่แล้วให้ไม่ทำอะไร
          create: user, // ถ้ายังไม่มีให้สร้างใหม่
        });
      }

      for(let brand of brands) {
        await tx.brand.create({
          data: {
            name: brand,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      for(let category of categories) {
        await tx.category.create({
          data: {
            name: category,
            description: 'Notebook for' + category,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      for(let tag of tags) {
        await tx.tag.create({
          data: {
            name: tag,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      for(let product of products) {
        await tx.product.create({
          data: {
            createdBy: {
              connect: { id: product.userId }
            },
            sku: generateUuidBasedSku('NBK'),
            name: product.name,
            description: product.description,
            brand: {
              connect: { id: product.brandId }
            },
            price: product.price,
            publish: true,
            inStock: {
              create: {
                inStock: 100
              }
            },
            categories: {
              create: product.categories.map(category => ({
                category: {
                  connect: { 
                    id: category.categoryId,
                  },
                },
                assignedBy: {
                  connect: { id: product.userId }
                }
              }))
            },
            tags: product.tags ? {
              create: product.tags.map(tag => ({
                tag: {
                  connect: {
                    id: tag.tagId
                  }
                },
                assignedBy: {
                  connect: { id: product.userId }
                }
              }))
            } : undefined,
            images: product.images ? {
              create: product.images.map((image : any, index) => ({
                url_path: image.url_path,
                sequence_order: index + 1,
                assignedBy: {
                  connect: { id: product.userId }
                }
              }))
            } : undefined,
            specs: {
              create: {
                screen_size: product.specs.screen_size,
                processor: product.specs.processor,
                display: product.specs.display,
                memory: product.specs.memory,
                storage: product.specs.storage,
                graphic: product.specs.graphic,
                operating_system: product.specs.operating_system,
                camera: product.specs.camera,
                optical_drive: product.specs.optical_drive,
                connection_ports: product.specs.connection_ports,
                wireless: product.specs.wireless,
                battery: product.specs.battery,
                color: product.specs.color,
                dimension: product.specs.dimension,
                weight: product.specs.weight,
                warranty: product.specs.warranty,
                option: product.specs.option,
              }
            }
          },
        });
      }

      for(let campaign of campaigns) {
        await tx.campaign.create({
          data: {
            name: campaign.name,
            description: campaign.description,
            discount: campaign.discount,
            createdBy: { connect: { id: 1 } }
          }
        });
      }

      for(let pCam of productsCampaign) {
        await tx.campaignProduct.create({
          data: {
            campaign: { connect: { id: pCam.campaignId } },
            product: { connect: { id: pCam.productId } },
            assignedBy: { connect: { id: pCam.userId } }
          }
        });
      }

      for (const customer of customers) {
        await tx.customer.upsert({
          where: { email: customer.email },
          update: {}, // ถ้ามีอยู่แล้วให้ไม่ทำอะไร
          create: {
            email: customer.email,
            password: customer.password,
            displayName: customer.displayName,
            lastActive: customer.lastActive,
            customerDetail: {
              create: {
                firstName: customer.customerDetail.firstName,
                lastName: customer.customerDetail.lastName
              }
            }
          }, // ถ้ายังไม่มีให้สร้างใหม่
        });
      }

      const wishlists = [
        { customerId: 1, productId: 1 },
        { customerId: 1, productId: 2 },
        { customerId: 2, productId: 1 },
        { customerId: 2, productId: 2 },
        { customerId: 2, productId: 3 },
        { customerId: 3, productId: 1 },
        { customerId: 3, productId: 3 },
        { customerId: 4, productId: 1 },
        { customerId: 4, productId: 2 },
        { customerId: 4, productId: 4 },
      ]
      for (const wish of wishlists) {
        await tx.wishlist.create({
          data: {
            customer: { connect: { id: wish.customerId } },
            product: { connect: { id: wish.productId } },
          }
        });
      }

      const reviews = [
        { 
          productId: 1,
          message: 'Good notebook for my game',
          rating: 4,
          customerId: 1,
          approved: true,
        },
        { 
          productId: 3,
          message: 'I want this',
          rating: 5,
          customerId: 2,
          approved: true,
        },
      ]
      for (const review of reviews) {
        await tx.review.create({
          data: {
            message: review.message,
            rating: review.rating,
            approved: review.approved,
            product: { connect: { id: review.productId } },
            createdBy: { connect: { id: review.customerId } },
          }
        });
      }

      // const carts = [
      //   { customerId: 1, productId: 1, quantity: 1 },
      //   { customerId: 2, productId: 3, quantity: 2 },
      // ]
      // for (const cart of carts) {
      //   await tx.cartItem.create({
      //     data: {
      //       customer: { connect: { id: cart.customerId } },
      //       product: { connect: { id: cart.productId } },
      //       quantity: cart.quantity
      //     }
      //   });
      // }

      const orders = [
        { 
          customerId: 1, 
          total: 79990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-25'),
          items: [{
            productId: 1,
            quantity: 1,
            sale_price: 79990
          }] 
        },
        { 
          customerId: 2, 
          total: 57990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-23'),
          items: [{
            productId: 3,
            quantity: 1,
            sale_price: 57990
          }] 
        },
        { 
          customerId: 3, 
          total: 55990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-27'),
          items: [{
            productId: 2,
            quantity: 1,
            sale_price: 55990
          }] 
        },
        { 
          customerId: 3, 
          total: 79990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-25'),
          items: [{
            productId: 1,
            quantity: 1,
            sale_price: 79990
          }] 
        },
        { 
          customerId: 4, 
          total: 57990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-22'),
          items: [{
            productId: 3,
            quantity: 1,
            sale_price: 57990
          }] 
        },
        { 
          customerId: 2, 
          total: 245990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-24'),
          items: [{
            productId: 4,
            quantity: 1,
            sale_price: 245990
          }] 
        },
        { 
          customerId: 1, 
          total: 245990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-04-28'),
          items: [{
            productId: 4,
            quantity: 1,
            sale_price: 245990
          }] 
        },
      ]
      for (const order of orders) {
        await tx.order.create({
          data: {
            customer: { connect: { id: order.customerId } },
            total: order.total,
            paymentStatus: order.paymentStatus as PaymentStatus,
            status: order.status as OrderStatus,
            orderItems: {
              create: order.items.map(i => ({
                quantity: i.quantity,
                product: { connect: { id: i.productId } },
                sale_price: i.sale_price
              }))
            }
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