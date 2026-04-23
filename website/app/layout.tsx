import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ndsoftware.dev'),
  title: {
    default: 'ND Software',
    template: '%s · ND Software',
  },
  description: 'Small, focused tools for iOS and macOS developers. Built by ND Software LLC.',
  openGraph: {
    title: 'ND Software',
    description: 'Small, focused tools for iOS and macOS developers.',
    url: 'https://ndsoftware.dev',
    siteName: 'ND Software',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ND Software',
    description: 'Small, focused tools for iOS and macOS developers.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
