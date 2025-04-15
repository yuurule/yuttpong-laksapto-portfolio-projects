import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import AuthProvider from '@/components/AuthProvider';
import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";
import { ToastContainer } from 'react-toastify';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comtech Shopping Store",
  description: "Shopping store for computer technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        suppressHydrationWarning={true} 
        className={`${inter.className}`}
      >
        <AuthProvider>
          <MainHeader />
          {children}
          <MainFooter />
        </AuthProvider>

        <ToastContainer
          theme="light"
          autoClose={3000}
          closeOnClick={true}
          newestOnTop={true}
        />
      </body>
    </html>
  );
}
