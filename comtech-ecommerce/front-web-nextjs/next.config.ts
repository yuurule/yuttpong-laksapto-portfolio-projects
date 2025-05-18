import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // แนะนำสำหรับการ deploy บน VPS
  //basePath: '/portfolio/comtech/frontend-website-nextjs',
  // ใช้ trailingSlash: true ถ้ามีปัญหากับ routing
  trailingSlash: true, 
};

export default nextConfig;
