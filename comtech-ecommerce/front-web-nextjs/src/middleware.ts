import { withAuth } from "next-auth/middleware";
export { default } from 'next-auth/middleware';
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export default withAuth(
//   function middleware(req) {
//     console.log(req.nextauth.token)
//   },
//   {
//     // callbacks: {
//     //   authorized({ req , token }) {
//     //     if(token) return true // If there is a token, the user is authenticated
//     //   }
//     // },
//     // Matches the pages config in `[...nextauth]`
//     pages: {
//       signIn: "/auth/signin",
//       //error: "/error",
//     },
//   }
  
// )

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token)
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   },
// )

// This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   console.log('Fuck you')

//   return NextResponse.redirect(new URL('/auth/signin', request.url))
// }

export const config = {
  matcher: [
    '/cart',
    '/checkout', 
    '/my-account/:path*'
  ],
};