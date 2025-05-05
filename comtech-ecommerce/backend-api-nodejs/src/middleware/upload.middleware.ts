import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from '../utils/errorHandler';

// สร้างโฟลเดอร์ uploads หากยังไม่มี
const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// กำหนด type สำหรับ multer file filter
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// กำหนดที่เก็บไฟล์และชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    // สร้างโฟลเดอร์ตาม ID ของสินค้า (ถ้ามี)
    const productId = req.params.id || 'temp';
    const productDir = path.join(uploadDir, productId.toString());
    
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    cb(null, productDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, uniqueSuffix + '-' + safeFilename);
  }
});

// ตรวจสอบประเภทไฟล์
const fileFilter : any = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('ไม่รองรับประเภทไฟล์นี้ เฉพาะไฟล์รูปภาพเท่านั้น', 400), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // จำกัดขนาดไฟล์ 10MB
  },
  fileFilter: fileFilter
});

export default upload;