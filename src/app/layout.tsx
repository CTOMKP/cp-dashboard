import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrivyProvider from "@/components/PrivyProvider";
import RouteThemeGuard from "@/components/RouteThemeGuard";
import { PrivyAuthProvider } from "@/contexts/PrivyAuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
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
            __html: `(function(){try{document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} bg-[#0A0A0A] text-white antialiased`}>
        <PrivyProvider>
          <QueryProvider>
            <PrivyAuthProvider>
              <RouteThemeGuard />
              {children}
            </PrivyAuthProvider>
          </QueryProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
