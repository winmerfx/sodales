import type { MetadataRoute } from "next";

import { clientEnv } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Customer and admin areas hold nothing a crawler should index, and
        // /api includes the webhook endpoint.
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
