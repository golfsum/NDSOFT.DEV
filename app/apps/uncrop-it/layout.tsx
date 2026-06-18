import type { Metadata } from 'next';

// Per-app favicon: applies to the Uncrop It app page and its nested
// /privacy and /terms routes, overriding the ND Software brand favicon
// set in the root layout.
export const metadata: Metadata = {
  icons: {
    icon: '/apps/uncrop-it/icon.png',
    apple: '/apps/uncrop-it/icon.png',
  },
};

export default function UncropItLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
