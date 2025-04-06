import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider  from 'next-auth/providers/credentials';
import type { User } from "next-auth";  
import { customerService } from '@/services';

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // ส่ง request ไปยัง API เพื่อ login
          const response = await customerService.signin(
            credentials.email, 
            credentials.password
          );

          //const data = await response.json();

          if (response && response.user) {
            // คืนค่าข้อมูลผู้ใช้และ token
            // ทำ type assertion เพื่อบอก TypeScript ว่านี่คือ User type ที่มี accessToken
            const user: User = {
              id: response.user.id,
              //name: data.user.name,
              //email: data.user.email,
              accessToken: response.accessToken, // property นี้ถูก extend ใน type แล้ว
            };

            return user;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    // เพิ่ม providers อื่นๆ ตามต้องการ
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 วัน
  },
  callbacks: {
    // สำคัญ: ตรงนี้เป็นการรับ token จาก JWT และเพิ่มเข้าไปใน session
    async jwt({ token, user }) {
      // เมื่อมีการ sign in สำเร็จ user จะมีค่า
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    // ตรงนี้เป็นการส่ง token ไปให้ client เพื่อใช้ใน session
    async session({ session, token }) {
      // ส่ง accessToken และข้อมูลอื่นๆ ไปกับ session
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // ถ้ามีหน้า custom signin
    // error: '/auth/error', // ถ้ามีหน้า error แบบ custom
    // signOut: '/auth/signout', // ถ้ามีหน้า signout แบบ custom
  },
};

export default NextAuth(authConfig)