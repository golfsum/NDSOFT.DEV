import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ND SOFT",
    short_name: "ND SOFT",
    description:
      "Independent software studio behind AppsResolve, Tranqly, PawProof, and TeeLesson.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d12",
    theme_color: "#0b0d12",
  };
}
