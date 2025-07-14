import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import VerifyBanner from '@/components/VerifyBanner'; // 👈 you'll create this component

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
        <ThemeProvider>
          <SidebarProvider>
            <VerifyBanner /> {/* 👈 This will show the banner if not verified */}
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
