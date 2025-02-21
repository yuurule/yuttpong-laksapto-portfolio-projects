import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import MainHeader from "@/components/MainHeader/MainHeader";
import MainFooter from "@/components/MainFooter/MainFooter";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ComTech Shopping Store",
  description: "Shopping store for computer technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <MainHeader />
        {children}
        <MainFooter />
      </body>
    </html>
  );
}
