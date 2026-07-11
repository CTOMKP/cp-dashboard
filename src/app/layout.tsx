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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ctom-creator-theme");document.documentElement.classList.remove("dark","light");document.documentElement.classList.add(t==="light"?"light":"dark");}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
