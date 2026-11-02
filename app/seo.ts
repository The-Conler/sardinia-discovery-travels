import type { Metadata } from "next";

// Shared SEO helpers: one place for the base URL, the share image and the
// Open Graph / Twitter tags, so every page gets the same complete set.
export const SITE_URL = "https://sardiniadiscoverytravels.com";
export const SITE_NAME = "Sardinia Discovery Travels";
export const SHARE_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "A motor yacht crossing clear turquoise water off the coast of Sardinia",
};

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}
