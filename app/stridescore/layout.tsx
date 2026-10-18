import type { Metadata } from "next";
import "./stridescore.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stridescore.ndsoft.dev"),
  title: {
    default: "StrideScore | Make Every Walk Count",
    template: "%s | StrideScore",
  },
  description:
    "StrideScore turns walks into focused activity sessions with steps, time, distance, routes, and progress.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "StrideScore | Make Every Walk Count",
    description: "Timed walking challenges, personal bests, routes, and an Apple Watch companion. Join the StrideScore TestFlight beta.",
    url: "https://stridescore.ndsoft.dev",
    siteName: "StrideScore",
    images: [{ url: "/stridescore/images/walking-landscape.png", width: 1026, height: 488, alt: "StrideScore desert landscape artwork" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrideScore | Make Every Walk Count",
    description: "Turn your next walk into a new personal best. Join the TestFlight beta.",
    images: ["/stridescore/images/walking-landscape.png"],
  },
};

export default function StrideScoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
