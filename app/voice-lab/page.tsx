import type { Metadata } from "next";
import VoiceLab from "./VoiceLab";

export const metadata: Metadata = {
  title: "Voice Lab | NDSOFT",
  description: "Prototype expressive character and story voice generator for game dialogue.",
  robots: { index: false, follow: false },
};

export default function VoiceLabPage() {
  return <VoiceLab />;
}
