import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CTOMarketplace Creator Program — Earn From Every Referral",
  description:
    "Join the CTOMarketplace Creator Program. Share your link and earn a percentage of every transaction your referrals generate forever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0A0A0A]">
      <body className={`${inter.variable} bg-[#0A0A0A] text-white antialiased`}>{children}</body>
    </html>
  );
}
