import { DefaultSession, DefaultUser } from 'next-auth';

// ขยาย type ของ Session
declare module "next-auth" {
  interface User {
    accessToken?: string;
    // เพิ่ม properties อื่นๆ ที่ต้องการได้ที่นี่
  }
  
  interface Session {
    accessToken?: string,
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

// สำหรับ next-auth/jwt
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}