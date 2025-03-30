import { DefaultSession } from 'next-auth';

// ขยาย type ของ Session
declare module "next-auth" {
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