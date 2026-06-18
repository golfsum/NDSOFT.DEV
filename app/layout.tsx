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
  description: 'Focused, beautifully simple apps for iPhone and iPad. Built by ND Software LLC.',
  openGraph: {
    title: 'ND Software',
    description: 'Focused, beautifully simple apps for iPhone and iPad.',
    url: 'https://ndsoftware.dev',
    siteName: 'ND Software',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ND Software',
    description: 'Focused, beautifully simple apps for iPhone and iPad.',
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
