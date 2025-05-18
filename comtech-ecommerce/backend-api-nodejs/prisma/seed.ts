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
          email: 'guest@example.com',
          password: await hashPassword('guest123'),
          displayName: 'Guest',
          role: Role.GUEST,
        },
      ];
      const brands = [
        "Asus", // 4
        "Acer", // 3
        "Dell", // 3
        "Lenovo", // 4
        "HP", // 3
        "MSI", // 4
      ];
      const categories = ["Work", "Gaming", "Student", "Graphic"];
      const tags = ["Hi-end", "Slim", "Performance", "Low price", "Big screen"];
      const products = [
        // Asus
        {
          userId: 1,
          name: "Asus Vivobook 15 OLED X1505VA-OLED529WA Silver",
          description: "ASUS Vivobook 15 OLED โน้ตบุ๊กทรงพลัง อัดแน่นด้วยคุณสมบัติมากมาย จอแสดงผล OLED HDR2 ให้ขอบเขตสี DCI-P3 100% และเป็นมิตรกับผู้ใช้งานโดยสามารถกางบานพับได้ 180 องศา มีตัวเลื่อนเปิดปิดเว็บแคมและปุ่มฟังก์ชันเฉพาะเพื่อเปิดหรือปิดไมค์ของคุณ ครบจบในเครื่องเดียว พร้อมใช้งานได้ทันที",
          brandId: 1,
          price: 22990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core i5-13420H, Up to 4.6 GHz, 8C(4P+4E)/12T, 12MB Cache",
            display: "FHD (1920 x 1080) OLED 16:9 aspect ratio",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Iris Xe Graphics",
            operating_system: "Windows 11 Home",
            camera: "720p HD camera ; With privacy shutter",
            optical_drive: "None",
            connection_ports: "1x USB 2.0 Type-A (data speed up to 480Mbps)",
            wireless: "Wi-Fi 6E(802.11ax) (Dual band) 1*1 + Bluetooth 5.3 Wireless Card ",
            battery: "50WHrs, 3S1P, 3-cell Li-ion",
            color: "Cool Silver",
            dimension: "35.68x22.76x1.99",
            weight: "1.70 Kg.",
            warranty: "3 Years Onsite service (1 Year Perfect warranty)",
            option: "Keyboard TH/EN // Chiclet Keyboard with Num-key // Microsoft Office Home 2024 + Microsoft 365 Basic"
          }
        },
        {
          userId: 1,
          name: "Asus Vivobook Go 15 X1504GA-NJ322W Mixed Black",
          description: "ASUS Vivobook Go 15 ได้รับการออกแบบมาเพื่อให้คุณทำงานได้อย่างมีประสิทธิภาพและอิสระ ด้วยบานพับแบบวางราบได้ 180 องศา   สะดวกสบาย และด้วยนํ้าหนักที่เบาสามารถไปกับคุณได้ทุกที่ที่ต้องการ",
          brandId: 1,
          price: 11990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core i3-N305, 1.80GHz up to 3.80GHz, 8C/8T, 6MB Intel Smart Cache",
            display: "FHD 1920x1080 @60Hz, 16:9 aspect ratio, ED Backlit, 250nits, 45% NTSC color gamut, Anti-glare display, TÜV Rheinland-certified",
            memory: "8GB",
            storage: "512GB SSD M.2",
            graphic: "Intel UHD Graphics",
            operating_system: "Windows 11 Home",
            camera: "HD 720p with Privacy Shutter",
            optical_drive: "N/A",
            connection_ports: "1x USB-C3.2, 1x USB3.2, 1x USB2.0, 1x HDMI v1.4, 1x 3.5mm Combo Audio Jack, 1x DC-in",
            wireless: "Wi-Fi 5(802.11ac) (Dual band) + Bluetooth v5.1",
            battery: "42Wh, 3S1P, 3-Cell Li-ion",
            color: "Mixed Black",
            dimension: "36.03x23.25x1.79",
            weight: "1.63 Kg",
            warranty: "2 Year Carry in / 1 Year Perfect warranty",
            option: "Keyboard TH/EN"
          }
        },
        {
          userId: 1,
          name: "Asus TUF Gaming A16 FA617NSR-N3016W Sandstorm",
          description: "ASUS TUF Gaming A16 Advantage Edition (2023) แล็ปท็อปสำหรับเล่นเกม  มาพร้อมกับ AMD Ryzen และ AMD Radeon  ทำให้เครื่องที่เป็น AMD ทั้งระบบนี้พร้อมที่จะใช้งานทั้งด้านเกมมิ่ง หรือมัลติทาสก์",
          brandId: 1,
          price: 32990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "16.0 inch",
            processor: "AMD Ryzen 7 7435HS, 3.10GHz up to 4.55GHz, 8C/16T, 20MB L3 Cache",
            display: "FHD+ 1920x1200 @165Hz, WUXGA, IPS.16:10, 100% SRGB, Anti-glare display",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "AMD Radeon Graphics",
            operating_system: "Windows 11 Home",
            camera: "HD 720p camera",
            optical_drive: "No",
            connection_ports: "1x USB-C3.2 (DP, Power Delivery), 1x USB-C3.2, 2x USB3.2, 1x RJ45 LAN port",
            wireless: "Wi-Fi 6(802.11ax) (Dual band) 2*2 + Bluetooth v5.3",
            battery: "90Wh, 4S1P, 4-Cell Li-ion",
            color: "Sandstorm",
            dimension: "35.5x25.2x2.68",
            weight: "2.20 Kg",
            warranty: "2 Year (Onsite Service) / 1 Year (Perfect Warranty)",
            option: "Keyboard TH/EN"
          }
        },
        {
          userId: 1,
          name: "Asus Zenbook 14 UX3407QA-QD001WA Beige",
          description: "Asus Zenbook 14 UX3407QA-QD001WA ดีไซน์สวยงาม ประสิทธิภาพสูงและมีฟีเจอร์ครบครัน ใช้งานได้ทั้งการทำงาน การเล่นเกมและความบันเทิงต่างๆ คุณภาพระดับพรีเมียมในราคาที่คุ้มค่า เหมาะกับทั้งการทำงานในทุกสถานการณ์และการใช้งานในชีวิตประจำวัน",
          brandId: 1,
          price: 39990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "14.0 inch",
            processor: "Snapdragon X X1-26-100, Up to 2.97GHz, 8C/8T, 30MB L3 Cache",
            display: "WUXGA (1920 x 1200) OLED @60Hz, 16:10 aspect ratio, 100% DCI-P3 color gamut",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Qualcomm Adreno",
            operating_system: "Windows 11 Home",
            camera: "FHD camera with IR function to support Windows Hello",
            optical_drive: "None",
            connection_ports: "2x USB-C4.0(DP,Power delivery), 1x USB-A3.2, 1x HDMI 2.1 TMDS, 1x 3.5mm Combo Audio Jack",
            wireless: "Wi-Fi 6E(802.11ax (Triple band) 2*2 + Bluetooth v5.3",
            battery: "70WHrs, 3S1P, 3-cell Li-ion",
            color: "Zabriskie Beige",
            dimension: "31.07x21.39x1.34",
            weight: "0.98 Kg.",
            warranty: "2 Years Carry / 1 Year Perfect warranty",
            option: "Keyboard TH/EN // Backlit Chiclet Keyboard / Microsoft Office Home and Student 2024 + Microsoft Basic 365"
          }
        },

        // Acer
        {
          userId: 1,
          name: "Acer Aspire Lite 15 AL15-33P-C2Z9 Gray",
          description: "โน๊ตบุ๊ค Acer Aspire Lite 15 ตัวเครื่องเพรียวบาง รูปลักษณ์สุดเท่ ดีไซน์ขอบจอบาง หน้าจอความละเอียดแบบ Full HD ที่คมชัด จอแสดงผลนี้ยังใช้เทคโนโลยี IPS ที่แสดงสีได้คมชัดสูงสุดถึง 178o1  Windows 11 ของแท้ เปิดเครื่องพร้อมใช้งานทันที ",
          brandId: 2,
          price: 11990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Processor N150, Up to 3.6GHz 4C/4T, 6 MB Cache",
            display: "IPS Full HD (1920x1080) Acer ComfyView",
            memory: "8GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Graphics",
            operating_system: "Windows 11 Home",
            camera: "Acer webcam",
            optical_drive: "No",
            connection_ports: "USB 3.2 X 1 , USB 2 X 1 , USB Type-C X 1",
            wireless: "Wi-Fi 6, 2x2 MU-MIMO",
            battery: "3 Cell",
            color: "Steel Gray",
            dimension: "35.34x24.6x1.8",
            weight: "1.43 Kg.",
            warranty: "2 Years (Parts/Labor/Onsite) Warranty",
            option: "Keyboard TH/EN // Microsoft Office Home & Student 2024"
          }
        },
        {
          userId: 1,
          name: "Acer Aspire Lite 15 AL15-71P-72TD Silver",
          description: "Acer Aspire Lite 15 โน๊ตบุ๊คสุดเท่ มีเอกลักษณ์เฉพาะตัว ด้วยพื้นที่หน้าจอขนาดใหญ่ในดีไซน์ขอบจอแบบบาง ทำให้พื้นที่การรับชมของคุณเพิ่มขึ้นในความละเอียดแบบ Full HD ที่คมชัด  Windows 10 ของแท้ เปิดเครื่องพร้อมใช้งานทันที",
          brandId: 2,
          price: 19990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core i7-12650H Processor, up to 4.7GHz, 10C(6P+4E)/16T, 24MB Smart Cache",
            display: "IPS Full HD (1920 x 1200)",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Graphics",
            operating_system: "Windows 11 Home",
            camera: "Camera FHD",
            optical_drive: "No",
            connection_ports: "USB 3.2 X 3 , 1 x USB Type-C",
            wireless: "Wi-Fi AX Wireless LAN 2x2 MU-MIMO",
            battery: "3 Cell",
            color: "Light Silver",
            dimension: "35.34x24.6x1.8",
            weight: "1.8 Kg.",
            warranty: "2 Years (Parts & Labor) Warranty",
            option: "Keyboard TH/EN // Microsoft Office Home & Student 2024"
          }
        },
        {
          userId: 1,
          name: "Acer Swift Go 14 SFG14-73-54C7 Pure Silver",
          description: "Acer Swift Go 14 โฉมใหม่ ซึ่งเป็น AI PC ที่มีระบบประมวลผล Intel Core Ultra  และภาพที่ยอดเยี่ยมของจอ 2.8K OLED ในดีไซน์ที่สวยสะดุดตาที่ทั้งบางและเบา เหมาะสำหรับการใช้งานที่ต้องออกไปข้างนอก!",
          brandId: 2,
          price: 27990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "14.0 inch",
            processor: "Intel Core Ultra 5 125H, up to 4.50GHz, 14C(4P+8E+2LPE)/18T, 18MB Intel Smart Cache",
            display: "2.8K 2880x1800, OLED, DCI-P3 100%, 16:10, high-brightness (400 nits)",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Arc Graphics",
            operating_system: "Windows 11 Home",
            camera: "Acer HD webcam (SHDR)",
            optical_drive: "No",
            connection_ports: "2x Thunderbolt 4 , 2x USB3.2",
            wireless: "Wi-Fi 7(802.11be) 2*2 MU-MIMO + Bluetooth v5.3",
            battery: "3-Cell",
            color: "Pure Silver",
            dimension: "31x21.79x1.49",
            weight: "1.3 Kg",
            warranty: "3 Years Onsite",
            option: "Keyboard TH/EN // Microsoft Office Home & Student 2021"
          }
        },

        // Dell
        {
          userId: 1,
          name: "Dell INSPIRON 5445-OIN5445301201GTH-IB-W Ice Blue",
          description: "Dell Inspiron 5445  ก้าวไปสู่ความสำเร็จด้วยแล็ปท็อปขนาด 14 นิ้ว โปรเซสเซอร์ AMD Ryzen 8000 Series พร้อมเทคโนโลยีซอฟต์แวร์ Dell ComfortView ที่ช่วยลดการปล่อยแสงสีน้ำเงินที่เป็นอันตราย เพื่อให้คุณมองเห็นหน้าจอได้นานขึ้น",
          brandId: 3,
          price: 26990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "14.0 inch",
            processor: "AMD Ryzen 5 8540U 3.2 GHz, up to 4.90 GHz, 6C/12T, 16 MB L3 Cache",
            display: "16:10 FHD+ (1920 x 1200) Anti-Glare Non-Touch 250nits WVA Display with ComfortView Support",
            memory: "16GB",
            storage: "1TB SSD M.2",
            graphic: "AMD Radeon Graphics",
            operating_system: "Windows 11 Home",
            camera: "720p at 30 fps HD camera, Single digital microphone",
            optical_drive: "None",
            connection_ports: "2 x USB 3.2 Gen 1 (5 Gbps) port, 1 x USB 3.2 Gen 2 (10 Gbps)",
            wireless: "Realtek Wi-Fi 6 RTL8852BE, 2x2, 802.11ax, MU-MIMO, Bluetooth wireless card",
            battery: "4 Cell, 54 Wh, integrated",
            color: "Ice Blue Plastic Cover",
            dimension: "37x31x7",
            weight: "1.61 Kg.",
            warranty: "2 Years Premium Support:Onsite Service-Retail",
            option: "Keyboard TH/EN // McAfee Multi Device Security 15 month subscription"
          }
        },
        {
          userId: 1,
          name: "Dell Inspiron 3530 OIN3530100501GTH Silver",
          description: "โน๊ตบุ๊ค Dell Inspiron 3530 ใหม่มีรูปลักษณ์ภายนอกที่ดูทันสมัยและประสิทธิภาพภายในที่เหนือชั้น สร้างขึ้นด้วยโปรเซสเซอร์ Intel เจเนอเรชันที่ 13 ช่วยให้คุณจัดการรายการที่ต้องทำเสร็จได้ในเวลาอันรวดเร็ว",
          brandId: 3,
          price: 14990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core i3 1305U, Up to 4.50 GHz, 5C(1P+4E)/6T, 10MB Cache",
            display: "FHD 1920x1080, 120Hz, Anti-Glare, 250 nit, Narrow Border, LED-Backlit",
            memory: "8GB",
            storage: "512GB SSD M.2",
            graphic: "Intel UHD Graphics",
            operating_system: "Windows 11 Home",
            camera: "Integrated widescreen HD (720p) Webcam with Single Digital Microphone in plastic chassis",
            optical_drive: "No",
            connection_ports: "1 x USB 3.2 Gen 1 port, 1x USB 3.2 Gen 1 (Type-C) port, 1 x USB 2.0 port, 1 x HDMI 1.4 port",
            wireless: "Realtek Wi-Fi 6 RTL8852BE, 2x2, 802.11ax, MU-MIMO, Bluetooth wireless card",
            battery: "3-Cell Battery, 41WHr (Integrated)",
            color: "Platinum Silver",
            dimension: "40.4x30.5x7.0",
            weight: "1.65 Kg.",
            warranty: "2 Years Premium Support (Onsite Service-Retail)",
            option: "Keyboard TH/EN // Microsoft Office 2021 + McAfee Multi Device Security 12 month subscription"
          }
        },
        {
          userId: 1,
          name: "DELL INSPIRON 5640-OIN5640251201GTH Ice Blue",
          description: "Dell INSPIRON 16  โน๊ตบุ๊คที่ให้คุณดื่มด่ำกับหน้าจอที่ชัดเจนและกว้างขวางด้วยประสิทธิภาพการทำงานที่ไร้ขีดจำกัด สลับระหว่างการทำงานหรือการเล่นบนหน้าจอขนาด 16 นิ้วความละเอียด 2.5K ที่ขับเคลื่อนด้วยโปรเซสเซอร์ Intel Core อันทรงประสิทธิภาพ",
          brandId: 3,
          price: 37990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "16.0 inch",
            processor: "Intel Core 7 150U, 1.8GHz up to 5.4GHz, 10C(2P+8E)/12T, 12MB Intel Smart Cache",
            display: "2.5K 2560x1600 16:10, Anti-Glar, 300nits, WVA Display w/ ComfortView Plus Support",
            memory: "16GB",
            storage: "1TB SSD M.2",
            graphic: "NVIDIA GeForce MX570A Laptop",
            operating_system: "Windows 11 Home",
            camera: "FHD 1080p at 30 fps Dual-array microphones, built-in camera shutter",
            optical_drive: "None",
            connection_ports: "1x USB-C, 2x USB-A, 1x headset, 1x HDMI 1.4 port, 1x power-adapter port, 1x SD-card slot",
            wireless: "Realtek Wi-Fi 6 RTL8852BE, 2*2, MU-MIMO + Bluetooth",
            battery: "54Wh, 4-Cell",
            color: "Ice Blue",
            dimension: "35.67x25.06x1.90",
            weight: "1.87 Kg",
            warranty: "2 Years Premium Support:Onsite Service-Retail",
            option: "Keyboard TH/EN // Ice Blue Tenkey Thai backlit Keyboard // Microsoft Home & student 2021"
          }
        },

        // Lenovo
        {
          userId: 1,
          name: "Lenovo IdeaPad Slim 3i 15IRH10-83K100DCTA Gray",
          description: "Lenovo IdeaPad Slim 3i 15IRH10 มีครบทุกสิ่งที่คุณต้องการไม่ว่าจะเป็นประสิทธิภาพ การเชื่อมต่อ และความบันเทิงแบบเคลื่อนที่ พร้อมโพรเซสเซอร์ intel gen13 ให้คุณเพลิดเพลินกับภาพอันคมกริบผ่านจอภาพขนาด 15นิ้ว สวมงามสบาย",
          brandId: 4,
          price: 18990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.3 inch",
            processor: "Intel Core i5-13420H, Up to 4.6 GHz, 8C(4P+4E)/12T, 12MB Cache",
            display: "IPS WUXGA (1920x1200) 300nits Anti-glare, 45% NTSC, 60Hz",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel UHD Graphics",
            operating_system: "Windows 11 home",
            camera: "HD 720p with Privacy Shutter",
            optical_drive: "N/A",
            connection_ports: "2x USB-A (USB 5Gbps / USB 3.2 Gen 1), 1x USB-C (USB 5Gbps / USB 3.2 Gen 1)",
            wireless: "Wi-Fi 6, 802.11ax 2x2 + Bluetooth v5.2",
            battery: "Integrated 50Wh",
            color: "Luna Grey",
            dimension: "34.34x23.95x16.9",
            weight: "1.59 Kg.",
            warranty: "2 Years Premium Care (Onsite)",
            option: "Keyboard TH/EN // Microsoft Office Home 2024"
          }
        },
        {
          userId: 1,
          name: "Lenovo LOQ 15IAX9-83GS00CNTA Gray",
          description: "Lenovo LOQ   ยกระดับการเล่นเกมและการทำงานด้วย   มาพร้อม Intel Gen 12+ RTX แรง ลื่น คีย์บอร์ดแม่นยำ พิมพ์สบาย ดีไซน์เรียบง่าย แข็งแรง พัดลมคู่ระบายความร้อนเงียบและทรงพลั งเล่นลื่นไม่มีสะดุด",
          brandId: 4,
          price: 20990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core i5-12450HX, Up to 4.4 GHz, 8C(4P+4E)/12T, 12MB Cache",
            display: "IPS FHD (1920x1080) 144Hz, 100% sRGB, 300nits Anti-glare, G-SYNC",
            memory: "12GB",
            storage: "512GB SSD M.2",
            graphic: "NVIDIA GeForce RTX 2050 Laptop",
            operating_system: "Windows 11 Home",
            camera: "FHD 720p with E-shutter",
            optical_drive: "N/A",
            connection_ports: "1x USB-C (USB 10Gbps / USB 3.2 Gen 2), with PD 140W and DisplayPort 1.4",
            wireless: "Wi-Fi 6, 11ax 2x2 + BT5.2 , 100/1000M",
            battery: "Integrated 60Wh",
            color: "Luna Grey",
            dimension: "35.98x25.87x21.9",
            weight: "2.38 kg",
            warranty: "2 Years Premium Care(onsite)",
            option: "TH/EN backlit Keyboard"
          }
        },
        {
          userId: 1,
          name: "Lenovo Yoga Slim 6 14IRH8-83E0004RTA Grey",
          description: "Lenovo YOGA Slim 6 ให้คุณได้รับประสบการณ์ที่เต็มตากว่า ขอบจอสุดบาง จะดูหนังก็ฟินด้วยภาพสีสันสุดสดใส ทั้งยังมาพร้อมแพลตฟอร์ม Intel gen13 ที่จะทำให้ตัวเครื่องพร้อมสำหรับทุกการใช้งานของคุณในทุกเวลา",
          brandId: 4,
          price: 26990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "14.0 inch",
            processor: "Intel Core i5-13500H, up to 4.7GHz, 12C(4P + 8E)/16T, 18MB Cache",
            display: "OLED 400nits Glossy, 100% DCI-P3, 60Hz, Eyesafe, Dolby Vision, DisplayHDR True Black 500",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Iris Xe Graphics",
            operating_system: "Windows 11 Home",
            camera: "FHD 1080p + IR with Privacy Shutter, ToF Sensor",
            optical_drive: "None",
            connection_ports: "1x USB-A (USB 5Gbps / USB 3.2 Gen 1), Always On",
            wireless: "Wi-Fi 6E, 802.11ax 2x2 + Bluetooth v5.3",
            battery: "Integrated 65Wh",
            color: "Grey",
            dimension: "31.2x22.1x1.49",
            weight: "1.35 Kg.",
            warranty: "3 Yesrs Premium Care(Onsite)",
            option: "คีย์บอร์ด ภาษาไทย / ภาษาอังกฤษ , Blacklit // Microsoft Office H&S 2021"
          }
        },
        {
          userId: 1,
          name: "Lenovo Yoga Slim 7i 14ILL10-83JX001FTA Grey",
          description: "โน๊ตบุ๊ค Lenovo Yoga Slim 7i ให้คุณได้รับประสบการณ์ที่เต็มตากว่าด้วยจอขอบสุดบาง จะดูหนังก็ฟินด้วยภาพสีสันสุดสดใส ทั้งยังมาพร้อมแพลตฟอร์ม Intel Core Ultra ที่จะทำให้ตัวเครื่องพร้อมสำหรับทุกการใช้งานของคุณในทุกเวลา",
          brandId: 4,
          price: 38990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "14.0 inch",
            processor: "Intel Core Ultra 5 228V, Up to 4.5GHz, 8C(4P+4LPE)/8T, 8MB Cache",
            display: "OLED 2.8K WQXGA+ (2880x1800) OLED 100% DCI-P3, 120Hz, Dolby Vision, Di",
            memory: "32GB",
            storage: "1TB SSD M.2",
            graphic: "Intel Arc Graphics",
            operating_system: "Windows 11 Home",
            camera: "5.0MP + IR with E-shutter",
            optical_drive: "No",
            connection_ports: "1x USB-A (USB 5Gbps / USB 3.2 Gen 1), Always On",
            wireless: "Wi-Fi 7, 802.11be 2x2 + Bluetooth v5.4",
            battery: "Integrated 70Wh",
            color: "Luna Grey",
            dimension: "31.2x21.93x1.39",
            weight: "1.19 kg.",
            warranty: "3Y Premium Care(Onsite) ( Battery , Adaptor ประกัน 1 ปี)",
            option: "Keyboard TH/EN / Backlit // Microsoft Office Home 2024"
          }
        },

        // HP
        {
          userId: 1,
          name: "HP 15-fc0477AU Silver",
          description: "HP 15-fc0477AU โน๊ตบุ๊คที่ดีไซน์โดดเด่นในเรื่องรองรับทุกการทำงานทนทาน สวยงาม ขนาดบางเบาแต่มีประสิทธิภาพ มาพร้อมฟีเจอร์ด้านความปลอดภัย สเปคแรงและดี",
          brandId: 5,
          price: 17990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "AMD Ryzen 5 5625U, Up to 4.3 GHz, 6C/12T, 16MB L3 Cache",
            display: "FHD (1920?1080)",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "AMD Radeon Graphics",
            operating_system: "Windows 11 Home",
            camera: "HP True Vision 720p HD camera with temporal noise reduction and integr",
            optical_drive: "No",
            connection_ports: "USB Type-C 5Gbps signaling rate supports data transfer only and does",
            wireless: "Realtek Wi-Fi 6 (2x2) and Bluetooth v5.4 wireless card",
            battery: "3-cell, 41 Wh Li-ion polymer",
            color: "Natural silver",
            dimension: "35.98x23.6x1.86",
            weight: "1.59 Kg.",
            warranty: "2 Years Onsite",
            option: "Keyboard TH/EN // Microsoft Office Home 2024"
          }
        },
        {
          userId: 1,
          name: "HP VICTUS 15-fb3063AX Silver",
          description: "HP VICTUS เป็นโน้ตบุ๊กสำหรับเล่นเกมระดับกลางที่ออกแบบมาสำหรับเกมเมอร์ที่ให้ความสำคัญกับราคาและเปี่ยมไปด้วยประสิทธิภาพ เปิดเครื่องพร้อมใช้งานได้ทันที",
          brandId: 5,
          price: 34990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "AMD Ryzen 7 8845HS 3.8 GHz, Up to 5.10 GHz, 8C/16T, 16 MB L3 Cache",
            display: "IPS FHD (1920 x 1080), 144 Hz, 300 nits, 62.5% sRGB, micro-edge, anti-",
            memory: "16GB",
            storage: "1TB SSD M.2",
            graphic: "NVIDIA GeForce RTX 4060 Laptop",
            operating_system: "Windows 11 Home",
            camera: "HP Wide Vision 720p HD camera with temporal noise reduction and Integr",
            optical_drive: "No",
            connection_ports: "1USB Type-A 5Gbps signaling rate (HP Sleep and Charge) 1USB Type-A 5G",
            wireless: "Wi-Fi 6E MT7922 (2?2) and Bluetooth 5.3 wireless",
            battery: "3 cells 52.5WHr",
            color: "Mica Silver",
            dimension: "6.9 x 52 x 30.6 cm.",
            weight: "2.29 Kg.",
            warranty: "2 Years Onsite",
            option: "TH/EN RGB Keyboard"
          }
        },
        {
          userId: 1,
          name: "HP 15-fc1036AU Silver",
          description: "HP 15-fc1036AU มาพร้อมคุณสมบัติมากมายเพื่อประสิทธิภาพการทำงาน โน้ตบุ๊ก HP ที่ทรงพลังเครื่องนี้สร้างขึ้นจากวัสดุรีไซเคิล มีโปรเซสเซอร์ AMD Ryzen และขอบจอบาง 3 ด้านยังให้พื้นที่มากมายสำหรับทำสิ่งต่างๆ",
          brandId: 5,
          price: 22990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "AMD Ryzen 7 7735HS 3.2 GHz, Up to 4.75 GHz, 8C/16T, 16 MB L3 Cache",
            display: "FHD (1920x1080) AG ultraslim SVA 250 nits Narrow Border",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "AMD Radeon Graphics",
            operating_system: "Windows 11 Home",
            camera: "HP True Vision 720p HD camera",
            optical_drive: "No",
            connection_ports: "USB Type-C 10Gbps signaling rate (USB Power Delivery",
            wireless: "Realtek Wi-Fi 6 (2x2) and Bluetooth 5.3 wireless card (supporting gigabit data rate)",
            battery: "3-cell, 41 Wh Li-ion polymer",
            color: "Natural Silver",
            dimension: "35.9 x 23.6 x 1.86 cm.",
            weight: "1.59 Kg.",
            warranty: "2 Years Onsite (1 Year Smart Friend)",
            option: "TH/EN Keyboard + Numpad // Microsoft Office 2024 + Microsoft 365 Basic"
          }
        },

        // MSI
        {
          userId: 1,
          name: "MSI Prestige 13 AI Evo A2HMG-245TH White",
          description: "โน๊ตบุ๊ค MSI Prestige 13 AI Evo สัมผัสพลังแห่ง AI ยกระดับประสิทธิภาพสู่ขีดสุด จอแสดงผลคมชัด ประสิทธิภาพทรงพลังและความคล่องตัวอย่างไร้ที่ติ มาพร้อมดีไซน์ที่เบาและแบตเตอรี่ที่ใช้งานได้นานยิ่งขึ้น พร้อมเสริมศักยภาพในทุกวัน ด้วยขุมพลัง AI อัจฉริยะเหนือระดับ",
          brandId: 6,
          price: 44990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "13.3 inch",
            processor: "Intel Core Ultra 7 255H, Up to 5.1 GHz, 16C(6P+8+2LPE)/16T, 24 MB Cache",
            display: "16:10, 2.8K (2880 x 1800) OLED panel, 100% DCI-P3 (Typ.)",
            memory: "32GB",
            storage: "1TB SSD M.2",
            graphic: "Intel Arc Graphics",
            operating_system: "Windows 11 Home",
            camera: "IR FHD type (30fps@1080p) with HDR 3D Noise Reduction+ (3DNR+)",
            optical_drive: "N/A",
            connection_ports: "2x Thunderbolt 4 (DisplayPort/ Power Delivery 3.0)",
            wireless: "Intel Killer BE Wi-Fi 7 + Bluetooth v5.4",
            battery: "4 cell, 75Whr",
            color: "Pure White",
            dimension: "29.9x21x1.6",
            weight: "0.99 Kg.",
            warranty: "2 Years Warranty (1 year Global+ 1 Year Thailand)",
            option: "Keyboard TH/EN // Single Backlit Keyboard (White) with Copilot Key // Microsoft Office Home and Student 2021"
          }
        },
        {
          userId: 1,
          name: "MSI Venture 15 AI A1MG-002TH Gray",
          description: "โน๊ตบุ๊ค MSI Venture 15 AI  มาพร้อมกับ โปรเซสเซอร์ Intel Core Ultra 7 รุ่น 155H เพื่อเร่งความเร็วในการทำงานของคุณ ด้วยฟีเจอร์ AI อัจฉริยะและดีไซน์ที่ทนทาน แล็ปท็อปเครื่องนี้จะช่วยให้คุณทำงานได้อย่างเต็มประสิทธิภาพทุกที่ทุกเวลา",
          brandId: 6,
          price: 27990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "15.6 inch",
            processor: "Intel Core Ultra 7 155H, Up to 4.8 GHz, 16C(6P+8E+2LPE)/22T, 24 MB Cache",
            display: "FHD (1920*1080), 144Hz 45%NTSC IPS-Level",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "Intel Arc Graphics",
            operating_system: "Windows 11 Home",
            camera: "HD type (30fps@720p)",
            optical_drive: "N/A",
            connection_ports: "1x Type-C (USB3.2 Gen2 / DisplayPort/ Power Delivery 3.0), 2x Type-A USB3.2 Gen1",
            wireless: "Wi-Fi 6E + Bluetooth v5.3",
            battery: "4 cell, 55.2Whr",
            color: "Solid Gray",
            dimension: "35.9x24.5x2.21",
            weight: "1.9 Kg",
            warranty: "2 Years Warranty (1 year Global+ 1 Year Thailand )",
            option: "Keyboard TH/EN // Single Backlit Keyboard (White) with Copilot Key"
          }
        },
        {
          userId: 1,
          name: "MSI Summit 16 AI Evo A2HMTG-033TH Black",
          description: "โน๊ตบุ๊ค MSI Summit 16 AI Evo สัมผัสประสิทธิภาพเหนือระดับและดีไซน์ที่โดดเด่นกับ Summit 16 AI Evo สัมผัสประสบการณ์ใหม่กับ จอสัมผัสขนาด 16 นิ้ว และ MSI Pen 2 ที่มอบความอิสระในการสร้างสรรค์ที่ไร้ขีดจำกัด ฟีเจอร์ AI อัจฉริยะจะปรับการทำงานของคุณให้มีประสิทธิภาพสูงสุด ทำให้ Summit 16 AI Evo เป็นคู่หูที่สมบูรณ์แบบในการบรรลุเป้าหมายที่คุณตั้งไว้ ไม่ว่าจะเป็นการทำงานสร้างสรรค์หรือการเพิ่มประสิทธิภาพในทุกขั้นตอน",
          brandId: 6,
          price: 56990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "16.0 inch [Touch Screen]",
            processor: "Intel Core Ultra 7 255H, Up to 5.1 GHz, 16C(6P+8E+2LPC)/16T, 24 MB Cache",
            display: "16:10 QHD+ (2560x1600), 165hz Touchscreen, 100% DCIP3, IPS-Level panel, Support MSI Pen 2",
            memory: "32GB",
            storage: "1TB SSD M.2",
            graphic: "Intel Arc Graphics",
            operating_system: "Windows 11 Home",
            camera: "IR FHD type (30fps@1080p) with HDR 3D Noise Reduction+ (3DNR+)",
            optical_drive: "N/A",
            connection_ports: "2x Thunderbolt 4 (DisplayPort/ Power Delivery 3.0), 2x Type-A USB3.2 Gen2",
            wireless: "Intel Killer BE Wi-Fi 7 + Bluetooth 5.4",
            battery: "4 cell, 82Whr",
            color: "Ink Black",
            dimension: "35.8x25.8x1.73",
            weight: "2.1 Kg.",
            warranty: "2 Years Warranty (1 year Global+ 1 Year Thailand)",
            option: "Keyboard TH/EN // Single Backlit Keyboard (White) with Copilot Key // Microsoft Office Home and Student 2024"
          }
        },
        {
          userId: 1,
          name: "MSI Vector 16 HX AI A2XWHG-253TH Gray",
          description: "โน๊ตบุ๊ค MSI Vector 16 HX AI มอบประสิทธิภาพล้ำสมัยและเสถียรภาพขั้นสูง สำหรับผู้เชี่ยวชาญด้าน STEM ทำหน้าที่เสมือนสมองกลอัจฉริยะ ประมวลผลข้อมูลที่ซับซ้อนด้วยความเร็วและความแม่นยำอย่างไร้รอยต่อ เปิดเครื่องพร้อมใช้งานได้ทันที",
          brandId: 6,
          price: 62990,
          categories: [],
          tags: [],
          images: [],
          specs: {
            screen_size: "16.0 inch",
            processor: "Intel Core Ultra 7 255HX, Up to 5.2 GHz, 20C(8P+12E)/20T, 30MB Cache",
            display: "QHD+(2560x1600), 240Hz Refresh Rate, IPS-Level, 100% DCI-P3(Typical)",
            memory: "16GB",
            storage: "512GB SSD M.2",
            graphic: "NVIDIA GeForce RTX 5070 Ti Laptop",
            operating_system: "Windows 11 Home",
            camera: "IR FHD type (30fps@1080p) with HDR 3D Noise Reduction+ (3DNR+)",
            optical_drive: "N/A",
            connection_ports: "2x Thunderbolt 5 (DisplayPort/ Power Delivery 3.1)",
            wireless: "Intel Wi-Fi 6E AX211, Bluetooth v5.3",
            battery: "4 cell, 90Whr",
            color: "Cosmos Gray",
            dimension: "35.7x28.4x2.2",
            weight: "2.7 Kg",
            warranty: "3 Years Warranty / (1 year Global+ 2 Year Thailand )",
            option: "Keyboard TH/EN // 24-Zone RGB Gaming Keyboard with Copilot Key // Microsoft Office Home and Student 2024"
          }
        },
      ]
      const campaigns = [
        {
          name: "Back to school",
          description: "Slim & good price notebook for student",
          discount: 15
        },
        {
          name: "Gaming Festival",
          description: "Hi-end notebook with best performance for hardcore gaming",
          discount: 10
        },
      ]
      // const productsCampaign = [
      //   { userId: 1, campaignId: 2, productId: 1 },
      //   { userId: 1, campaignId: 2, productId: 2 },
      //   { userId: 1, campaignId: 2, productId: 4 },
      //   { userId: 1, campaignId: 1, productId: 3 },
      // ]
      const customers = [
        {
          email: 'johndoh@mail.com',
          password: await hashPassword('123456'),
          displayName: 'John2025',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'John',
            lastName: 'Doh'
          }
        },
        {
          email: 'sweely@mail.com',
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
            firstName: 'Yammy',
            lastName: 'Lannawee'
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
        {
          email: 'sweuk@mail.com',
          password: await hashPassword('123456'),
          displayName: 'Sweuker',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Sweuker',
            lastName: 'Mahery'
          }
        },
        {
          email: 'baamboo@mail.com',
          password: await hashPassword('123456'),
          displayName: 'BaambooBaa',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Baam',
            lastName: 'Bokory'
          }
        },
        {
          email: 'zendy@mail.com',
          password: await hashPassword('123456'),
          displayName: 'Zenzen',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Zendy',
            lastName: 'Macaver'
          }
        },
        {
          email: 'juubjib@mail.com',
          password: await hashPassword('123456'),
          displayName: 'Jooob',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Jib',
            lastName: 'Vahuty'
          }
        },
        {
          email: 'fukin@mail.com',
          password: await hashPassword('123456'),
          displayName: 'Kunkin',
          lastActive: new Date(),
          customerDetail: {
            firstName: 'Frankin',
            lastName: 'Loperbuo'
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
            // categories: {
            //   create: product.categories.map(category => ({
            //     category: {
            //       connect: { 
            //         id: category.categoryId,
            //       },
            //     },
            //     assignedBy: {
            //       connect: { id: product.userId }
            //     }
            //   }))
            // },
            // tags: product.tags ? {
            //   create: product.tags.map(tag => ({
            //     tag: {
            //       connect: {
            //         id: tag.tagId
            //       }
            //     },
            //     assignedBy: {
            //       connect: { id: product.userId }
            //     }
            //   }))
            // } : undefined,
            images: product.images ? {
              create: product.images.map((image : any, index) => ({
                path: image.path,
                filename: '',
                mimetype: '',
                size: 100,
                sequence_order: index + 1,
                createdBy: {
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

      // for(let pCam of productsCampaign) {
      //   await tx.campaignProduct.create({
      //     data: {
      //       campaign: { connect: { id: pCam.campaignId } },
      //       product: { connect: { id: pCam.productId } },
      //       assignedBy: { connect: { id: pCam.userId } }
      //     }
      //   });
      // }

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

      let orderNumberBegin = new Date().toISOString().split('T')[0]
      orderNumberBegin = orderNumberBegin.replaceAll('-', '')
      const orders = [
        { 
          orderNumber: orderNumberBegin + '-00001',
          customerId: 2, 
          total: 22990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-24'),
          items: [{
            productId: 1,
            quantity: 1,
            sale_price: 22990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00002',
          customerId: 3, 
          total: 22990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-25'),
          items: [{
            productId: 1,
            quantity: 1,
            sale_price: 22990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00003',
          customerId: 1, 
          total: 11990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-25'),
          items: [{
            productId: 5,
            quantity: 1,
            sale_price: 11990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00004',
          customerId: 8, 
          total: 11990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-25'),
          items: [{
            productId: 2,
            quantity: 1,
            sale_price: 11990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00005',
          customerId: 4, 
          total: 26990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-26'),
          items: [{
            productId: 13,
            quantity: 1,
            sale_price: 26990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00006',
          customerId: 6, 
          total: 14990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-26'),
          items: [{
            productId: 9,
            quantity: 1,
            sale_price: 14990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00007',
          customerId: 5, 
          total: 44990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-27'),
          items: [{
            productId: 18,
            quantity: 1,
            sale_price: 44990
          }] 
        },
        { 
          orderNumber: orderNumberBegin + '-00008',
          customerId: 7, 
          total: 56990,
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: new Date('2025-05-18'),
          items: [{
            productId: 20,
            quantity: 1,
            sale_price: 56990
          }] 
        },
      ]
      for (const order of orders) {
        await tx.order.create({
          data: {
            orderNumber: order.orderNumber,
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