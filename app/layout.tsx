import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// 🟢 เปลี่ยน Metadata ตรงนี้ ให้รองรับการทำ PWA (เสกเป็นแอป)
export const metadata: Metadata = {
  title: 'Digital Store',
  description: 'Premium digital products for devs',
  manifest: '/manifest.json', // แจ้งเบราว์เซอร์ว่าเป็น PWA
  themeColor: '#fce7f3', // สีชมพูพาสเทล ให้แถบด้านบนมือถือเป็นสีนี้
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Digital Store',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
