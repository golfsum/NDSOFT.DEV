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
};

export default function StrideScoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
