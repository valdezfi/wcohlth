import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import VerifyBanner from '@/components/VerifyBanner/VerifyBanner';
import { SessionProvider } from "next-auth/react"; // ✅ import this

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProvider> {/* ✅ wrap everything */}
          <ThemeProvider>
            <SidebarProvider>
              <VerifyBanner />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
