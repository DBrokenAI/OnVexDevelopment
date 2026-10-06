import type { MetadataRoute } from "next";

// Makes OnVex installable ("Add to Home Screen"), which iPhones require
// before they allow push alerts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OnVex Web Development",
    short_name: "OnVex",
    description: "Sites, clients, tasks and alerts for OnVex Web Development.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#1B2333",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
