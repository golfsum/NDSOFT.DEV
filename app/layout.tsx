import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "ND SOFT | Independent Software Studio";
const description =
  "ND SOFT is the independent studio behind AppsResolve, Tranqly, PawProof, and TeeLesson.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ndsoft.dev"),
  title,
  description,
  alternates: { canonical: "/" },
  applicationName: "ND SOFT",
  authors: [{ name: "ND SOFT LLC", url: "https://ndsoft.dev" }],
  creator: "ND SOFT LLC",
  publisher: "ND SOFT LLC",
  keywords: [
    "ND SOFT",
    "AppsResolve",
    "Tranqly",
    "PawProof",
    "TeeLesson",
    "independent software studio",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ND SOFT",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ND SOFT, four products from one independent studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
